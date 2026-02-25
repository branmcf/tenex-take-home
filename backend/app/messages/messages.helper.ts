import {
    Either
    , error
    , success
} from '../../types';
import { ResourceError } from '../../errors';
import { generateLLMText, ChatHistoryMessage } from '../../lib/llm';
import { runWorkflow, WorkflowRunResult } from '../../lib/workflowRunner';
import {
    LLMRequestFailed
    , ChatAccessForbidden
    , WorkflowRunInProgress
    , WorkflowExecutionFailed
    , WorkflowRunTimeout
} from './messages.errors';
import {
    SourceResponse
    , MessageResponse
    , ResolveChatResult
    , WorkflowStartResult
    , ChatResponseResult
    , UserMessageData
} from './messages.types';
import {
    getChatById
    , createChat
    , createMessage
    , updateChatTitle
    , getMessagesByChatId
} from './messages.service';
import { getRunningWorkflowRunByChatId } from '../workflowRuns/workflowRuns.service';
import {
    buildChatTitlePrompt
    , buildChatHistorySummaryPrompt
    , formatConversationHistoryForPrompt
    , HISTORY_SUMMARY_TRIGGER
    , HISTORY_RECENT_MESSAGES
    , HISTORY_SUMMARY_MAX_WORDS
} from '../../utils/constants';
import { chatEvents } from '../../lib/chatEvents';

// role mapping from GraphQL MessageRole enum to response role type
/* eslint-disable @typescript-eslint/naming-convention */
const MESSAGE_ROLE_MAP: Record<string, 'user' | 'assistant' | 'system'> = {
    USER: 'user'
    , ASSISTANT: 'assistant'
    , SYSTEM: 'system'
};
/* eslint-enable @typescript-eslint/naming-convention */

/**
 * map a GraphQL MessageRole enum value to the response role type
 *
 * @param role - the GraphQL MessageRole enum value
 * @returns the mapped role type ('user' | 'assistant' | 'system')
 */
export const mapMessageRole = (
    role: string
): 'user' | 'assistant' | 'system' => {

    // return mapped role or default to 'assistant'
    return MESSAGE_ROLE_MAP[ role ] || 'assistant';
};

/**
 * fetch and format chat history for LLM context
 *
 * @param chatId - the chat to fetch history for
 * @param modelId - the model to use for summarization if needed
 * @returns processed chat history
 */
export const fetchAndProcessChatHistory = async (
    chatId: string
    , modelId: string
): Promise<ChatHistoryMessage[]> => {

    // get messages from the database
    const messagesResult = await getMessagesByChatId( chatId );

    // if error, return empty history (no history available is fine)
    if ( messagesResult.isError() ) {
        return [];
    }

    // extract message nodes
    const nodes = messagesResult.value?.messagesByChatId?.nodes ?? [];

    // convert to ChatHistoryMessage format
    const messages: ChatHistoryMessage[] = nodes
        .filter( ( msg ): msg is NonNullable<typeof msg> => msg !== null )
        .map( msg => ( {
            role: mapMessageRole( msg.role )
            , content: msg.content
        } ) );

    // process history (summarize if too long)
    return processChatHistory( { messages, modelId } );
};

/**
 * Summarize older chat history for context
 *
 * @param params - history + model configuration
 * @returns summary string or null
 */
const summarizeChatHistory = async (
    params: {
        messages: ChatHistoryMessage[];
        modelId: string;
    }
): Promise<string | null> => {

    if ( params.messages.length === 0 ) {
        return null;
    }

    const prompt = buildChatHistorySummaryPrompt( {
        conversationHistory: formatConversationHistoryForPrompt( params.messages )
        , maxWords: HISTORY_SUMMARY_MAX_WORDS
    } );

    const summaryResult = await generateLLMText( {
        modelId: params.modelId
        , prompt
        , maxTokens: 300
        , temperature: 0.2
        , useRAG: false
    } );

    if ( summaryResult.isError() ) {
        return null;
    }

    return summaryResult.value.content.trim();
};

/**
 * Build conversation context from history with optional summarization
 *
 * @param summary - summary of older messages (or null)
 * @param recentMessages - recent messages to include verbatim
 * @returns formatted context string or null
 */
const buildConversationContext = (
    summary: string | null
    , recentMessages: ChatHistoryMessage[]
): string | null => {

    if ( recentMessages.length === 0 && !summary ) {
        return null;
    }

    const recentBlock = recentMessages.length > 0
        ? formatConversationHistoryForPrompt( recentMessages )
        : '';

    if ( summary && summary.length > 0 && recentBlock.length > 0 ) {
        return `Summary of earlier messages:\n${ summary }\n\nRecent messages:\n${ recentBlock }`;
    }

    if ( summary && summary.length > 0 ) {
        return `Summary of conversation:\n${ summary }`;
    }

    return recentBlock;
};

/**
 * Process chat history: summarize older messages if needed,
 * keep recent ones verbatim
 *
 * @param params - history processing parameters
 * @returns processed conversation history ready for LLM
 */
export const processChatHistory = async (
    params: {
        messages: ChatHistoryMessage[];
        modelId: string;
    }
): Promise<ChatHistoryMessage[]> => {

    const { messages, modelId } = params;

    if ( messages.length === 0 ) {
        return [];
    }

    // if history is short enough, return as-is
    if ( messages.length <= HISTORY_SUMMARY_TRIGGER ) {
        return messages;
    }

    // split into older (to summarize) and recent (to keep verbatim)
    const cutoffIndex = Math.max( messages.length - HISTORY_RECENT_MESSAGES, 0 );
    const olderMessages = messages.slice( 0, cutoffIndex );
    const recentMessages = messages.slice( cutoffIndex );

    // summarize older messages
    const summary = await summarizeChatHistory( {
        messages: olderMessages
        , modelId
    } );

    // build context and return as a system message + recent messages
    const context = buildConversationContext( summary, [] );

    if ( context ) {
        // prepend summary as a system message, then include recent messages
        return [ { role: 'system' as const, content: `[Conversation context]\n${ context }` }, ...recentMessages ];
    }

    return recentMessages;
};

/**
 * generate a response from the LLM based on the user's message
 *
 * @param params - the parameters for generating the response
 * @returns Either<ResourceError, { content: string; sources: SourceResponse[] }> - the LLM response
 */
export const generateLLMResponse = async (
    params: {
        userMessage: string;
        modelId: string;
        conversationHistory?: ChatHistoryMessage[];
    }
): Promise<Either<ResourceError, { content: string; sources: SourceResponse[] }>> => {

    // call the LLM lib function with conversation history
    const result = await generateLLMText( {
        modelId: params.modelId
        , prompt: params.userMessage
        , conversationHistory: params.conversationHistory
    } );

    // check for error
    if ( result.isError() ) {

        // return the error
        return error( new LLMRequestFailed() );
    }

    // return success with the generated text and sources
    return success( {
        content: result.value.content
        , sources: result.value.sources
    } );

};

/**
 * generate a title for a chat based on the first user message
 *
 * @param params - the parameters for generating the title
 * @returns Either<ResourceError, void> - success or error
 */
export const generateAndUpdateChatTitle = async (
    params: {
        chatId: string;
        userMessage: string;
        modelId: string;
    }
): Promise<Either<ResourceError, void>> => {

    // create a prompt to generate a concise chat title
    const titlePrompt = buildChatTitlePrompt( params.userMessage );

    // call the LLM to generate a title (without RAG to save time/cost)
    const result = await generateLLMText( {
        modelId: params.modelId
        , prompt: titlePrompt
        , useRAG: false
    } );

    // check for error
    if ( result.isError() ) {

        // return the error
        return error( new LLMRequestFailed() );
    }

    // clean up the generated title (remove quotes if present)
    let title = result.value.content.trim();

    // remove leading/trailing quotes
    title = title.replace( /^["']|["']$/g, '' );

    // limit to 100 characters
    title = title.substring( 0, 100 );

    // update the chat with the generated title
    const updateResult = await updateChatTitle( {
        chatId: params.chatId
        , title
    } );

    // check for error
    if ( updateResult.isError() ) {

        // return the error
        return error( updateResult.value );
    }

    // emit event so SSE listeners can notify frontend
    chatEvents.emitTitleUpdated( params.chatId, title );

    // return success
    return success( undefined );

};

/**
 * generate a fallback title for a chat when LLM is unavailable
 * uses the first ~50 characters of the user message
 *
 * @param params - the parameters for generating the fallback title
 * @returns Either<ResourceError, void> - success or error
 */
export const generateFallbackChatTitle = async (
    params: {
        chatId: string;
        userMessage: string;
    }
): Promise<Either<ResourceError, void>> => {

    // extract first ~50 chars, truncate at word boundary
    let title = params.userMessage.trim();

    if ( title.length > 50 ) {
        title = title.substring( 0, 50 );

        // truncate at last space to avoid cutting words
        const lastSpace = title.lastIndexOf( ' ' );

        if ( lastSpace > 30 ) {
            title = title.substring( 0, lastSpace );
        }

        title = title + '...';
    }

    // clean up any newlines/multiple spaces
    title = title.replace( /\s+/g, ' ' ).trim();

    // fallback if message is empty/whitespace
    if ( !title ) {
        const now = new Date();
        title = `Chat from ${ now.toLocaleDateString( 'en-US', {
            month: 'short'
            , day: 'numeric'
            , year: 'numeric'
        } ) }`;
    }

    // update the chat with the fallback title
    const updateResult = await updateChatTitle( {
        chatId: params.chatId
        , title
    } );

    // check for error
    if ( updateResult.isError() ) {

        // return the error
        return error( updateResult.value );
    }

    // emit event so SSE listeners can notify frontend
    chatEvents.emitTitleUpdated( params.chatId, title );

    // return success
    return success( undefined );

};

/**
 * resolve or create a chat, verifying user ownership
 *
 * @param params - chatId and userId
 * @returns Either<ResourceError, ResolveChatResult> - isNewChat flag or error
 */
export const resolveOrCreateChat = async (
    params: {
        chatId: string;
        userId: string;
    }
): Promise<Either<ResourceError, ResolveChatResult>> => {

    // check if chat exists
    const getChatByIdResult = await getChatById( params.chatId );

    // if chat doesn't exist, create it
    if ( getChatByIdResult.isError() ) {

        // create a new chat
        const createChatResult = await createChat( {
            id: params.chatId
            , userId: params.userId
        } );

        // check for errors
        if ( createChatResult.isError() ) {
            return error( createChatResult.value );
        }

        // return success with isNewChat = true
        return success( { isNewChat: true } );
    }

    // chat exists - verify user owns it
    const chat = getChatByIdResult.value;

    if ( chat && chat.userId !== params.userId ) {
        return error( new ChatAccessForbidden() );
    }

    // return success with isNewChat = false
    return success( { isNewChat: false } );

};

/**
 * check that no workflow is currently running on this chat
 *
 * @param chatId - the chat to check
 * @returns Either<ResourceError, void> - success or error if workflow is running
 */
export const assertNoRunningWorkflow = async (
    chatId: string
): Promise<Either<ResourceError, void>> => {

    // check for running workflow
    const runningWorkflowResult = await getRunningWorkflowRunByChatId( chatId );

    // check for errors
    if ( runningWorkflowResult.isError() ) {
        return error( runningWorkflowResult.value );
    }

    // if a workflow is running, return error
    if ( runningWorkflowResult.value ) {
        return error( new WorkflowRunInProgress() );
    }

    // no workflow running
    return success( undefined );

};

/**
 * start a workflow asynchronously and return the run ID early
 *
 * uses a callback pattern to get the workflowRunId as soon as
 * the run record is created, before the workflow completes.
 * the actual workflow result is handled asynchronously.
 *
 * @param params - workflow execution parameters
 * @returns Either<ResourceError, WorkflowStartResult> - workflowRunId or error
 */
export const startWorkflowAsync = async (
    params: {
        workflowId: string;
        chatId: string;
        triggerMessageId: string;
        userMessage: string;
        modelId: string;
        isNewChat: boolean;
    }
): Promise<Either<ResourceError, WorkflowStartResult>> => {

    // capture resolve/reject for the early callback promise
    let resolveRunId: ( workflowRunId: string ) => void = () => undefined;
    let rejectRunId: ( err: ResourceError ) => void = () => undefined;

    const workflowRunIdPromise = new Promise<string>( ( resolve, reject ) => {
        resolveRunId = resolve;
        rejectRunId = reject as ( err: ResourceError ) => void;
    } );

    let runIdResolved = false;
    let workflowRunIdValue: string | null = null;

    // start workflow execution (not awaited to completion)
    const workflowExecutionPromise = runWorkflow( {
        workflowId: params.workflowId
        , chatId: params.chatId
        , triggerMessageId: params.triggerMessageId
        , userMessage: params.userMessage
        , modelId: params.modelId
        , callbacks: {
            onRunCreated: ( workflowRunId: string ) => {
                runIdResolved = true;
                workflowRunIdValue = workflowRunId;
                resolveRunId( workflowRunId );
            }
        }
    } );

    // handle workflow completion asynchronously (after HTTP response sent)
    workflowExecutionPromise
        .then( async result => {
            await handleWorkflowCompletion( {
                result
                , chatId: params.chatId
                , userMessage: params.userMessage
                , modelId: params.modelId
                , isNewChat: params.isNewChat
                , workflowRunIdValue
                , runIdResolved
                , rejectRunId
            } );
        } )
        .catch( err => {
            // eslint-disable-next-line no-console
            console.error( 'Workflow execution failed:', err );

            if ( !runIdResolved ) {
                rejectRunId( new WorkflowExecutionFailed() );
            }
        } );

    // wait for the workflow run ID (or timeout)
    let timeoutId: NodeJS.Timeout | null = null;

    try {
        const timeoutPromise = new Promise<string>( ( _, reject ) => {
            timeoutId = setTimeout( () => {
                reject( new WorkflowRunTimeout() );
            }, 5000 );
        } );

        const workflowRunId = await Promise.race( [ workflowRunIdPromise, timeoutPromise ] );

        if ( timeoutId ) {
            clearTimeout( timeoutId );
        }

        return success( { workflowRunId } );

    } catch ( err ) {
        if ( timeoutId ) {
            clearTimeout( timeoutId );
        }

        const resourceError = err as ResourceError;

        // store a system message so the user sees the failure in chat
        const systemMessageContent = 'Failed to start the selected workflow. Your message has been saved — please try again.';

        await createMessage( {
            chatId: params.chatId
            , role: 'system'
            , content: systemMessageContent
            , modelId: params.modelId
        } );

        // if this is a new chat, generate fallback title
        if ( params.isNewChat ) {
            await generateFallbackChatTitle( {
                chatId: params.chatId
                , userMessage: params.userMessage
            } );
        }

        return error( resourceError );
    }

};

/**
 * handle workflow completion asynchronously
 *
 * this runs AFTER the HTTP response has been sent,
 * saving the assistant message or error message to the chat.
 *
 * @param params - completion handler parameters
 */
const handleWorkflowCompletion = async (
    params: {
        result: Either<ResourceError, WorkflowRunResult>;
        chatId: string;
        userMessage: string;
        modelId: string;
        isNewChat: boolean;
        workflowRunIdValue: string | null;
        runIdResolved: boolean;
        rejectRunId: ( err: ResourceError ) => void;
    }
): Promise<void> => {

    const {
        result
        , chatId
        , userMessage
        , modelId
        , isNewChat
        , workflowRunIdValue
        , runIdResolved
        , rejectRunId
    } = params;

    // handle workflow failure
    if ( result.isError() ) {

        if ( !runIdResolved ) {
            rejectRunId( result.value );
        }

        const systemMessageContent = 'Workflow execution failed. Please review the steps and try again.';

        await createMessage( {
            chatId
            , role: 'system'
            , content: systemMessageContent
            , modelId
            , workflowRunId: workflowRunIdValue ?? undefined
        } );

        if ( isNewChat ) {
            await generateFallbackChatTitle( {
                chatId
                , userMessage
            } );
        }

        return;
    }

    // handle workflow success
    const createAssistantMessageResult = await createMessage( {
        chatId
        , role: 'assistant'
        , content: result.value.content
        , modelId
        , workflowRunId: result.value.workflowRunId
    } );

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

    if ( isNewChat ) {
        generateAndUpdateChatTitle( {
            chatId
            , userMessage
            , modelId
        } ).catch( err => {
            // eslint-disable-next-line no-console
            console.error( '[Chat Title] Failed to generate title:', err );
        } );
    }

};

/**
 * generate a chat response using the LLM with conversation history
 *
 * @param params - chat response parameters
 * @returns Either<ResourceError, ChatResponseResult> - content and sources or error
 */
export const generateChatResponseWithHistory = async (
    params: {
        chatId: string;
        userMessage: string;
        modelId: string;
    }
): Promise<Either<ResourceError, ChatResponseResult>> => {

    // fetch and process conversation history for context
    const conversationHistory = await fetchAndProcessChatHistory(
        params.chatId
        , params.modelId
    );

    // generate LLM response with conversation history
    const generateResult = await generateLLMResponse( {
        userMessage: params.userMessage
        , modelId: params.modelId
        , conversationHistory
    } );

    // check for error
    if ( generateResult.isError() ) {
        return error( generateResult.value );
    }

    // return success with content and sources
    return success( {
        assistantContent: generateResult.value.content
        , sources: generateResult.value.sources
    } );

};

/**
 * build a user message response object
 *
 * @param userMessageData - data from persisted user message
 * @param content - the message content
 * @returns MessageResponse object
 */
export const buildUserMessageResponse = (
    userMessageData: UserMessageData
    , content: string
): MessageResponse => {

    return {
        id: userMessageData.id
        , role: 'user'
        , content
        , createdAt: userMessageData.createdAt
    };

};

/**
 * build an assistant message response object
 *
 * @param assistantMessageData - data from persisted assistant message
 * @param content - the message content
 * @param sources - optional RAG sources
 * @returns MessageResponse object
 */
export const buildAssistantMessageResponse = (
    assistantMessageData: UserMessageData
    , content: string
    , sources: SourceResponse[]
): MessageResponse => {

    return {
        id: assistantMessageData.id
        , role: 'assistant'
        , content
        , createdAt: assistantMessageData.createdAt
        , sources: sources.length > 0 ? sources : undefined
    };

};
