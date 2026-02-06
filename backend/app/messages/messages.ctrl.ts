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
import { generateLLMResponse, generateAndUpdateChatTitle, generateFallbackChatTitle, processChatHistory } from './messages.helper';
import { runWorkflow } from '../../lib/workflowRunner';
import { streamLLMText, ChatHistoryMessage } from '../../lib/llm';
import { ChatAccessForbidden, WorkflowRunInProgress } from './messages.errors';
import { getRunningWorkflowRunByChatId } from '../workflowRuns/workflowRuns.service';

/**
 * Fetch and format chat history for LLM context
 *
 * @param chatId - the chat to fetch history for
 * @param modelId - the model to use for summarization if needed
 * @returns processed chat history
 */
const fetchAndProcessChatHistory = async (
    chatId: string
    , modelId: string
): Promise<ChatHistoryMessage[]> => {

    const messagesResult = await getMessagesByChatId( chatId );

    if ( messagesResult.isError() ) {
        // no history available, that's fine
        return [];
    }

    const nodes = messagesResult.value?.messagesByChatId?.nodes ?? [];

    // convert to ChatHistoryMessage format
    const roleMap: Record<string, 'user' | 'assistant' | 'system'> = {
        'USER': 'user'
        , 'ASSISTANT': 'assistant'
        , 'SYSTEM': 'system'
    };

    const messages: ChatHistoryMessage[] = nodes
        .filter( ( msg ): msg is NonNullable<typeof msg> => msg !== null )
        .map( msg => ( {
            role: roleMap[ msg.role ] || 'assistant'
            , content: msg.content
        } ) );

    // process history (summarize if too long)
    return processChatHistory( { messages, modelId } );
};

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
    const { content, modelId, userId, workflowId } = req.body;

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

    // block new messages when a workflow is already running
    const runningWorkflowResult = await getRunningWorkflowRunByChatId( chatId );

    if ( runningWorkflowResult.isError() ) {
        return res
            .status( runningWorkflowResult.value.statusCode )
            .json( runningWorkflowResult.value );
    }

    if ( runningWorkflowResult.value ) {
        const error = new WorkflowRunInProgress();
        return res
            .status( error.statusCode )
            .json( error );
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

    // if a workflow is selected, start it asynchronously and return workflow run id
    if ( workflowId ) {

        // create a promise to resolve when the workflow run is created
        let resolveRunId: ( workflowRunId: string ) => void = () => undefined;
        let rejectRunId: ( err: ResourceError ) => void = () => undefined;

        const workflowRunIdPromise = new Promise<string>( ( resolve, reject ) => {
            resolveRunId = resolve;
            rejectRunId = reject as ( err: ResourceError ) => void;
        } );

        let runIdResolved = false;
        let workflowRunIdValue: string | null = null;

        // kick off workflow execution in the background
        const workflowExecutionPromise = runWorkflow( {
            workflowId
            , chatId
            , triggerMessageId: userMessageData.id
            , userMessage: content
            , modelId
            , callbacks: {
                onRunCreated: ( workflowRunId: string ) => {
                    runIdResolved = true;
                    workflowRunIdValue = workflowRunId;
                    resolveRunId( workflowRunId );
                }
            }
        } );

        // handle workflow completion asynchronously
        workflowExecutionPromise
            .then( async result => {
                if ( result.isError() ) {

                    // reject the run id promise if the workflow failed before creating a run
                    if ( !runIdResolved ) {
                        rejectRunId( result.value );
                    }

                    // if the workflow failed, create a system message
                    const systemMessageContent = 'Workflow execution failed. Please review the steps and try again.';

                    await createMessage( {
                        chatId
                        , role: 'system'
                        , content: systemMessageContent
                        , modelId
                        , workflowRunId: workflowRunIdValue ?? undefined
                    } );

                    // if this is a new chat, generate fallback title
                    if ( isNewChat ) {
                        await generateFallbackChatTitle( {
                            chatId
                            , userMessage: content
                        } );
                    }

                    return;
                }

                // create the assistant message with workflow output
                const createAssistantMessageResult = await createMessage( {
                    chatId
                    , role: 'assistant'
                    , content: result.value.content
                    , modelId
                    , workflowRunId: result.value.workflowRunId
                } );

                // check for errors creating assistant message
                if ( createAssistantMessageResult.isError() ) {
                    // eslint-disable-next-line no-console
                    console.error( 'Failed to store workflow assistant message', createAssistantMessageResult.value );

                    await createMessage( {
                        chatId
                        , role: 'system'
                        , content: 'Workflow completed, but the response failed to save. Please retry.'
                        , modelId
                        , workflowRunId: result.value.workflowRunId
                    } );
                    return;
                }

                // if this is a new chat, generate and update the title
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
            } )
            .catch( err => {
                // eslint-disable-next-line no-console
                console.error( 'Workflow execution failed:', err );

                // reject the run id promise if the workflow failed before creating a run
                if ( !runIdResolved ) {
                    rejectRunId( new ResourceError( {
                        message: 'Workflow execution failed.'
                        , clientMessage: 'Workflow execution failed.'
                    } ) );
                }
            } );

        // wait for the workflow run id or timeout
        let workflowRunId: string;

        let timeoutId: NodeJS.Timeout | null = null;

        try {
            const timeoutPromise = new Promise<string>( ( _, reject ) => {
                timeoutId = setTimeout( () => {
                    reject( new ResourceError( {
                        message: 'Timed out waiting for workflow run.'
                        , clientMessage: 'Timed out waiting for workflow run.'
                    } ) );
                }, 5000 );
            } );

            workflowRunId = await Promise.race( [ workflowRunIdPromise, timeoutPromise ] );

            if ( timeoutId ) {
                clearTimeout( timeoutId );
            }
        } catch ( err ) {
            // ensure timeout is cleared
            // (timeoutId may not be set if promise resolved immediately)
            if ( timeoutId ) {
                clearTimeout( timeoutId );
            }

            const error = err as ResourceError;

            // store a system message so the user sees the failure in chat
            const systemMessageContent = 'Failed to start the selected workflow. Your message has been saved — please try again.';

            await createMessage( {
                chatId
                , role: 'system'
                , content: systemMessageContent
                , modelId
            } );

            // if this is a new chat, generate fallback title
            if ( isNewChat ) {
                await generateFallbackChatTitle( {
                    chatId
                    , userMessage: content
                } );
            }

            const userMessage: MessageResponse = {
                id: userMessageData.id
                , role: 'user'
                , content
                , createdAt: userMessageData.createdAt
            };

            return res.status( 201 ).json( {
                userMessage
                , assistantMessage: null
                , chatId
                , error: {
                    message: error.message ?? 'Workflow start failed'
                    , code: 'WORKFLOW_RUN_FAILED'
                }
            } );
        }

        // map the user message to response format
        const userMessage: MessageResponse = {
            id: userMessageData.id
            , role: 'user'
            , content
            , createdAt: userMessageData.createdAt
        };

        // return response with workflow run id (assistant message will arrive later)
        return res.status( 201 ).json( {
            userMessage
            , assistantMessage: null
            , chatId
            , workflowRunId
        } );
    }

    // fetch and process conversation history for context
    const conversationHistory = await fetchAndProcessChatHistory( chatId, modelId );

    // generate LLM response with conversation history
    const generateLLMResponseResult = await generateLLMResponse( {
        userMessage: content
        , modelId
        , conversationHistory
    } );

    if ( generateLLMResponseResult && generateLLMResponseResult.isError() ) {

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
    const llmResponseData = generateLLMResponseResult ? generateLLMResponseResult.value : null;

    // create the assistant message
    const assistantContent = llmResponseData?.content ?? '';

    const createAssistantMessageResult = await createMessage( {
        chatId
        , role: 'assistant'
        , content: assistantContent
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
    if ( llmResponseData ) {
        const sourcePromises = llmResponseData.sources.map( ( source, index ) =>
            createMessageSource( {
                messageId: assistantMessageData.id
                , url: source.url
                , title: source.title
                , description: source.description
                , position: index
            } )
        );

        const sourceResults = await Promise.all( sourcePromises );

        for ( const sourceResult of sourceResults ) {
            if ( sourceResult.isError() ) {
                return res
                    .status( sourceResult.value.statusCode )
                    .json( sourceResult.value );
            }
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
        , content: assistantContent
        , createdAt: assistantMessageData.createdAt
        , sources: llmResponseData ? llmResponseData.sources : undefined
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
