import {
    Either
    , error
    , success
} from '../../types';
import { ResourceError } from '../../errors';
import { generateLLMText, ChatHistoryMessage } from '../../lib/llm';
import { LLMRequestFailed } from './messages.errors';
import { SourceResponse } from './messages.types';
import { updateChatTitle, getMessagesByChatId } from './messages.service';
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
