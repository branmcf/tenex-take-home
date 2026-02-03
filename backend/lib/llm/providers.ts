import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import type { LanguageModel } from 'ai';

/**
 * get the model provider based on the model id
 *
 * @param modelId - the model id from the database
 * @returns the model provider instance
 */
export const getModelProvider = ( modelId: string ): LanguageModel => {

    // detect provider based on model id prefix
    if ( modelId.startsWith( 'gpt-' ) ) {
        return openai( modelId );
    }

    if ( modelId.startsWith( 'claude-' ) ) {
        return anthropic( modelId );
    }

    if ( modelId.startsWith( 'gemini-' ) ) {
        return google( modelId );
    }

    // fallback to openai if unknown provider
    return openai( 'gpt-4o' );

};
