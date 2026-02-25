import { Response } from 'express';
import { ResourceError } from '../../errors';
import {
    createMessage
    , createMessageSource
    , getMessagesByChatId
} from './messages.service';
import {
    CreateMessageRequest
    , CreateMessageResponse
    , GetMessagesByChatIdRequest
    , GetMessagesByChatIdResponse
    , MessageResponse
} from './messages.types';
import {
    generateAndUpdateChatTitle
    , generateFallbackChatTitle
    , fetchAndProcessChatHistory
    , mapMessageRole
    , resolveOrCreateChat
    , assertNoRunningWorkflow
    , startWorkflowAsync
    , generateChatResponseWithHistory
    , buildUserMessageResponse
    , buildAssistantMessageResponse
} from './messages.helper';
import { streamLLMText } from '../../lib/llm';
import { getChatById, createChat } from './messages.service';

/**
 * @title Create Message Handler
 * @notice Creates a new user message and generates an assistant response.
 *
 * This handler supports two distinct flows:
 *
 * 1. **Regular chat flow** (no workflow selected):
 *    - Fetch conversation history
 *    - Generate LLM response (with RAG if needed)
 *    - Save assistant message and return both messages
 *
 * 2. **Workflow flow** (workflowId provided):
 *    - Start workflow execution asynchronously via `startWorkflowAsync()`
 *    - Return immediately with `workflowRunId` so client can subscribe to SSE
 *    - Workflow completion is handled in background via the helper
 *
 * @param req Express request
 * @param res Express response
 */
export const createMessageHandler = async (
    req: CreateMessageRequest
    , res: Response<ResourceError | CreateMessageResponse>
): Promise<Response<ResourceError | CreateMessageResponse>> => {

    const { chatId } = req.params;
    const {
        content, modelId, userId, workflowId
    } = req.body;

    /*
     * =========================================================================
     * PHASE 1: Chat Resolution
     * =========================================================================
     */

    const chatResult = await resolveOrCreateChat( { chatId, userId } );

    if ( chatResult.isError() ) {
        return res
            .status( chatResult.value.statusCode )
            .json( chatResult.value );
    }

    const { isNewChat } = chatResult.value;

    /*
     * =========================================================================
     * PHASE 2: Workflow Run Guard
     * =========================================================================
     */

    const guardResult = await assertNoRunningWorkflow( chatId );

    if ( guardResult.isError() ) {
        return res
            .status( guardResult.value.statusCode )
            .json( guardResult.value );
    }

    /*
     * =========================================================================
     * PHASE 3: Persist User Message
     * =========================================================================
     */

    const createUserMessageResult = await createMessage( {
        chatId
        , role: 'user'
        , content
        , modelId
    } );

    if ( createUserMessageResult.isError() ) {
        return res
            .status( createUserMessageResult.value.statusCode )
            .json( createUserMessageResult.value );
    }

    const userMessageData = createUserMessageResult.value;

    /*
     * =========================================================================
     * PHASE 4A: Workflow Execution Flow
     * =========================================================================
     */

    if ( workflowId ) {

        const startResult = await startWorkflowAsync( {
            workflowId
            , chatId
            , triggerMessageId: userMessageData.id
            , userMessage: content
            , modelId
            , isNewChat
        } );

        if ( startResult.isError() ) {
            return res.status( 201 ).json( {
                userMessage: buildUserMessageResponse( userMessageData, content )
                , assistantMessage: null
                , chatId
                , error: {
                    message: startResult.value.message ?? 'Workflow start failed'
                    , code: 'WORKFLOW_RUN_FAILED'
                }
            } );
        }

        return res.status( 201 ).json( {
            userMessage: buildUserMessageResponse( userMessageData, content )
            , assistantMessage: null
            , chatId
            , workflowRunId: startResult.value.workflowRunId
        } );
    }

    /*
     * =========================================================================
     * PHASE 4B: Regular Chat Flow (No Workflow)
     * =========================================================================
     */

    const responseResult = await generateChatResponseWithHistory( {
        chatId
        , userMessage: content
        , modelId
    } );

    if ( responseResult.isError() ) {

        // for new chats, save a system error message
        if ( isNewChat ) {

            const systemMessageContent = 'Failed to get a response from the AI model. The service may be temporarily unavailable or the API key may not be configured correctly. Your message has been saved — please try again.';

            await createMessage( {
                chatId
                , role: 'system'
                , content: systemMessageContent
                , modelId
            } );

            await generateFallbackChatTitle( {
                chatId
                , userMessage: content
            } );

            return res.status( 201 ).json( {
                userMessage: buildUserMessageResponse( userMessageData, content )
                , assistantMessage: null
                , chatId
                , error: {
                    message: 'LLM request failed'
                    , code: 'LLM_ERROR'
                }
            } );
        }

        return res
            .status( responseResult.value.statusCode )
            .json( responseResult.value );
    }

    /*
     * =========================================================================
     * PHASE 5: Persist Assistant Response
     * =========================================================================
     */

    const { assistantContent, sources } = responseResult.value;

    const createAssistantMessageResult = await createMessage( {
        chatId
        , role: 'assistant'
        , content: assistantContent
        , modelId
    } );

    if ( createAssistantMessageResult.isError() ) {
        return res
            .status( createAssistantMessageResult.value.statusCode )
            .json( createAssistantMessageResult.value );
    }

    const assistantMessageData = createAssistantMessageResult.value;

    // save sources
    const sourcePromises = sources.map( ( source, index ) =>
        createMessageSource( {
            messageId: assistantMessageData.id
            , url: source.url
            , title: source.title
            , description: source.description
            , position: index
        } ) );

    const sourceResults = await Promise.all( sourcePromises );

    for ( const sourceResult of sourceResults ) {
        if ( sourceResult.isError() ) {
            return res
                .status( sourceResult.value.statusCode )
                .json( sourceResult.value );
        }
    }

    /*
     * =========================================================================
     * PHASE 6: Post-Response Tasks
     * =========================================================================
     */

    if ( isNewChat ) {
        generateAndUpdateChatTitle( {
            chatId
            , userMessage: content
            , modelId
        } ).catch( err => {
            // eslint-disable-next-line no-console
            console.error( '[Chat Title] Failed to generate title:', err );
        } );
    }

    return res.status( 201 ).json( {
        userMessage: buildUserMessageResponse( userMessageData, content )
        , assistantMessage: buildAssistantMessageResponse(
            assistantMessageData
            , assistantContent
            , sources
        )
        , chatId
    } );

};

/**
 * @title Get Messages By Chat ID Handler
 * @notice Returns all messages for a chat.
 * @param req Express request
 * @param res Express response
 */
export const getMessagesByChatIdHandler = async (
    req: GetMessagesByChatIdRequest
    , res: Response<ResourceError | GetMessagesByChatIdResponse>
): Promise<Response<ResourceError | GetMessagesByChatIdResponse>> => {

    // get the chatId from the url params
    const { chatId } = req.params;

    // get all messages for the chat from the database
    const getMessagesByChatIdResult = await getMessagesByChatId( chatId );

    // check for errors
    if ( getMessagesByChatIdResult.isError() ) {

        // return the error
        return res
            .status( getMessagesByChatIdResult.value.statusCode )
            .json( getMessagesByChatIdResult.value );
    }

    // get the messages nodes
    const messagesNodes = getMessagesByChatIdResult.value?.messagesByChatId?.nodes ?? [];

    // map the messages to response format, filtering out null values
    const messages: MessageResponse[] = messagesNodes
        .filter( ( message ): message is NonNullable<typeof message> => message !== null )
        .map( message => {

            // get the sources nodes
            const sourcesNodes = message.messageSourcesByMessageId?.nodes ?? [];

            // map the sources to response format, filtering out null values
            const sources = sourcesNodes
                .filter( ( source ): source is NonNullable<typeof source> => source !== null )
                .map( source => ( {
                    url: source.url
                    , title: source.title
                    , description: source.description ?? undefined
                } ) );

            // map MessageRole enum to response role type
            const role = mapMessageRole( message.role );

            // return the message in response format
            return {
                id: message.id
                , role
                , content: message.content
                , createdAt: message.createdAt
                , sources: sources.length > 0 ? sources : undefined
            };
        } );

    // return success
    return res.status( 200 ).json( { messages } );

};

/**
 * @title Create Message with Streaming Handler
 * @notice Creates a new user message and streams
 * the assistant response in real-time.
 * @param req Express request
 * @param res Express response
 */
export const createMessageStreamHandler = async (
    req: CreateMessageRequest
    , res: Response
): Promise<Response> => {

    // get the chatId from the url params
    const { chatId } = req.params;

    // get the message content, modelId, and userId from the body
    const { content, modelId, userId } = req.body;

    // check if chat exists
    const getChatByIdResult = await getChatById( chatId );

    // track if this is a new chat
    let isNewChatForStreaming = false;

    // if chat doesn't exist, create it
    if ( getChatByIdResult.isError() ) {

        // create a new chat
        const createChatResult = await createChat( {
            id: chatId
            , userId
        } );

        // check for errors
        if ( createChatResult.isError() ) {

            // return the error as JSON
            return res
                .status( createChatResult.value.statusCode )
                .json( createChatResult.value );
        }

        // mark as new chat
        isNewChatForStreaming = true;
    }

    // create the user message
    const createUserMessageResult = await createMessage( {
        chatId
        , role: 'user'
        , content
        , modelId
    } );

    // check for errors
    if ( createUserMessageResult.isError() ) {

        // return the error as JSON
        return res
            .status( createUserMessageResult.value.statusCode )
            .json( createUserMessageResult.value );
    }

    // store the user message data
    const userMessageData = createUserMessageResult.value;

    // set headers for SSE (Server-Sent Events)
    res.setHeader( 'Content-Type', 'text/event-stream' );
    res.setHeader( 'Cache-Control', 'no-cache' );
    res.setHeader( 'Connection', 'keep-alive' );

    try {

        // fetch and process conversation history for context
        const conversationHistory = await fetchAndProcessChatHistory( chatId, modelId );

        // stream LLM response with conversation history
        const { textStream, sources } = await streamLLMText( {
            modelId
            , prompt: content
            , conversationHistory
        } );

        // accumulate the full response
        let fullResponse = '';

        // send user message first
        res.write( `data: ${ JSON.stringify( {
            type: 'user_message'
            , message: {
                id: userMessageData.id
                , role: 'user'
                , content
                , createdAt: userMessageData.createdAt
            }
        } ) }\n\n` );

        // stream tokens to client
        for await ( const chunk of textStream ) {
            fullResponse += chunk;
            res.write( `data: ${ JSON.stringify( {
                type: 'token'
                , token: chunk
            } ) }\n\n` );
        }

        // create the assistant message with the full response
        const createAssistantMessageResult = await createMessage( {
            chatId
            , role: 'assistant'
            , content: fullResponse
            , modelId
        } );

        // check for errors
        if ( createAssistantMessageResult.isError() ) {

            // send error event
            res.write( `data: ${ JSON.stringify( {
                type: 'error'
                , error: createAssistantMessageResult.value
            } ) }\n\n` );
            res.end();
            return res;
        }

        // store the assistant message data
        const assistantMessageData = createAssistantMessageResult.value;

        // create message sources
        const sourcePromises = sources.map( ( source, index ) =>
            createMessageSource( {
                messageId: assistantMessageData.id
                , url: source.url
                , title: source.title
                , description: source.description
                , position: index
            } ) );

        // wait for all sources to be created
        await Promise.all( sourcePromises );

        // if this is a new chat, generate and update the title
        if ( isNewChatForStreaming ) {
            // don't await - let it run in background
            generateAndUpdateChatTitle( {
                chatId
                , userMessage: content
                , modelId
            } ).catch( err => {
                // log error but don't fail the request
                // eslint-disable-next-line no-console
                console.error( '[Chat Title] Failed to generate title:', err );
            } );
        }

        // send completion event with assistant message and sources
        res.write( `data: ${ JSON.stringify( {
            type: 'complete'
            , message: {
                id: assistantMessageData.id
                , role: 'assistant'
                , content: fullResponse
                , createdAt: assistantMessageData.createdAt
                , sources
            }
            , chatId
        } ) }\n\n` );

        // end the response
        res.end();
        return res;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( _err ) {

        /*
         * if this is a new chat, store a system message
         * and generate fallback title
         */
        if ( isNewChatForStreaming ) {

            // create system error message
            const systemMessageContent = 'Failed to get a response from the AI model. The service may be temporarily unavailable or the API key may not be configured correctly. Your message has been saved — please try again.';

            await createMessage( {
                chatId
                , role: 'system'
                , content: systemMessageContent
                , modelId
            } );

            // generate fallback title from user's message
            await generateFallbackChatTitle( {
                chatId
                , userMessage: content
            } );
        }

        // send error event with more context
        res.write( `data: ${ JSON.stringify( {
            type: 'error'
            , error: {
                message: 'Streaming failed'
                , code: 'STREAMING_ERROR'
            }
            , chatId
        } ) }\n\n` );
        res.end();
        return res;

    }

};
