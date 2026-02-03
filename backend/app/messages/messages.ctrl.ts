import { Response } from 'express';
import { ResourceError } from '../../errors';
import {
    getChatById
    , createChat
    , createMessage
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
import { generateLLMResponse, generateAndUpdateChatTitle, generateFallbackChatTitle } from './messages.helper';
import { streamLLMText } from '../../lib/llm';
import { ChatAccessForbidden } from './messages.errors';

/**
 * @title Create Message Handler
 * @notice Creates a new user message and generates an assistant response.
 * @param req Express request
 * @param res Express response
 */
export const createMessageHandler = async (
    req: CreateMessageRequest
    , res: Response<ResourceError | CreateMessageResponse>
): Promise<Response<ResourceError | CreateMessageResponse>> => {

    // get the chatId from the url params
    const { chatId } = req.params;

    // get the message content, modelId, and userId from the body
    const { content, modelId, userId } = req.body;

    // check if chat exists
    const getChatByIdResult = await getChatById( chatId );

    // track if this is a new chat
    let isNewChat = false;

    // if chat doesn't exist, create it
    if ( getChatByIdResult.isError() ) {

        // create a new chat
        const createChatResult = await createChat( {
            id: chatId
            , userId
        } );

        // check for errors
        if ( createChatResult.isError() ) {

            // return the error
            return res
                .status( createChatResult.value.statusCode )
                .json( createChatResult.value );
        }

        // mark as new chat
        isNewChat = true;
    } else {

        // chat exists - verify user owns it
        const chat = getChatByIdResult.value;

        if ( chat && chat.userId !== userId ) {

            // return forbidden error
            const forbiddenError = new ChatAccessForbidden();
            return res
                .status( forbiddenError.statusCode )
                .json( forbiddenError );
        }
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

        // return the error
        return res
            .status( createUserMessageResult.value.statusCode )
            .json( createUserMessageResult.value );
    }

    // store the user message data
    const userMessageData = createUserMessageResult.value;

    // generate LLM response
    const generateLLMResponseResult = await generateLLMResponse( {
        userMessage: content
        , modelId
    } );

    // check for errors
    if ( generateLLMResponseResult.isError() ) {

        // if this is a new chat, store a system message and generate fallback title
        // so the user can see what happened and retry
        if ( isNewChat ) {

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

            // map the user message to response format
            const userMessage: MessageResponse = {
                id: userMessageData.id
                , role: 'user'
                , content
                , createdAt: userMessageData.createdAt
            };

            // return partial success with user message (no assistant message)
            // frontend will fetch messages and see the system error
            return res.status( 201 ).json( {
                userMessage
                , assistantMessage: null
                , chatId
                , error: {
                    message: 'LLM request failed'
                    , code: 'LLM_ERROR'
                }
            } );
        }

        // for existing chats, just return the error
        return res
            .status( generateLLMResponseResult.value.statusCode )
            .json( generateLLMResponseResult.value );
    }

    // store the LLM response data
    const llmResponseData = generateLLMResponseResult.value;

    // create the assistant message
    const createAssistantMessageResult = await createMessage( {
        chatId
        , role: 'assistant'
        , content: llmResponseData.content
        , modelId
    } );

    // check for errors
    if ( createAssistantMessageResult.isError() ) {

        // return the error
        return res
            .status( createAssistantMessageResult.value.statusCode )
            .json( createAssistantMessageResult.value );
    }

    // store the assistant message data
    const assistantMessageData = createAssistantMessageResult.value;

    // create message sources for the assistant message
    const sourcePromises = llmResponseData.sources.map( ( source, index ) =>
        createMessageSource( {
            messageId: assistantMessageData.id
            , url: source.url
            , title: source.title
            , description: source.description
            , position: index
        } )
    );

    // wait for all sources to be created
    const sourceResults = await Promise.all( sourcePromises );

    // check if any source creation failed
    for ( const sourceResult of sourceResults ) {
        if ( sourceResult.isError() ) {

            // return the error
            return res
                .status( sourceResult.value.statusCode )
                .json( sourceResult.value );
        }
    }

    // if this is a new chat, generate and update the title
    if ( isNewChat ) {
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

    // map the user message to response format
    const userMessage: MessageResponse = {
        id: userMessageData.id
        , role: 'user'
        , content
        , createdAt: userMessageData.createdAt
    };

    // map the assistant message to response format
    const assistantMessage: MessageResponse = {
        id: assistantMessageData.id
        , role: 'assistant'
        , content: llmResponseData.content
        , createdAt: assistantMessageData.createdAt
        , sources: llmResponseData.sources
    };

    // return success
    return res.status( 201 ).json( {
        userMessage
        , assistantMessage
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
            const roleMap: Record<string, 'user' | 'assistant' | 'system'> = {
                'USER': 'user'
                , 'ASSISTANT': 'assistant'
                , 'SYSTEM': 'system'
            };
            const role = roleMap[ message.role ] || 'assistant';

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
 * @notice Creates a new user message and streams the assistant response in real-time.
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

        // stream LLM response
        const { textStream, sources } = await streamLLMText( {
            modelId
            , prompt: content
        } );

        // accumulate the full response
        let fullResponse = '';

        // send user message first
        res.write( `data: ${JSON.stringify( {
            type: 'user_message'
            , message: {
                id: userMessageData.id
                , role: 'user'
                , content
                , createdAt: userMessageData.createdAt
            }
        } )}\n\n` );

        // stream tokens to client
        for await ( const chunk of textStream ) {
            fullResponse += chunk;
            res.write( `data: ${JSON.stringify( {
                type: 'token'
                , token: chunk
            } )}\n\n` );
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
            res.write( `data: ${JSON.stringify( {
                type: 'error'
                , error: createAssistantMessageResult.value
            } )}\n\n` );
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
            } )
        );

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
        res.write( `data: ${JSON.stringify( {
            type: 'complete'
            , message: {
                id: assistantMessageData.id
                , role: 'assistant'
                , content: fullResponse
                , createdAt: assistantMessageData.createdAt
                , sources
            }
            , chatId
        } )}\n\n` );

        // end the response
        res.end();
        return res;

    } catch ( err ) {

        // if this is a new chat, store a system message and generate fallback title
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
        res.write( `data: ${JSON.stringify( {
            type: 'error'
            , error: {
                message: 'Streaming failed'
                , code: 'STREAMING_ERROR'
            }
            , chatId
        } )}\n\n` );
        res.end();
        return res;

    }

};
