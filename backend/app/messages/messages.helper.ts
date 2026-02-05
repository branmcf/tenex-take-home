import {
    Either
    , error
    , success
} from '../../types';
import { ResourceError } from '../../errors';
import { generateLLMText } from '../../lib/llm';
import { LLMRequestFailed } from './messages.errors';
import { SourceResponse } from './messages.types';
import { updateChatTitle } from './messages.service';
import { buildChatTitlePrompt } from '../../utils/constants';

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
    }
): Promise<Either<ResourceError, { content: string; sources: SourceResponse[] }>> => {

    // call the LLM lib function
    const result = await generateLLMText( {
        modelId: params.modelId
        , prompt: params.userMessage
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

    // return success
    return success( undefined );

};
