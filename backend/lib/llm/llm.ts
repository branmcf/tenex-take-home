import { generateText, streamText } from 'ai';
import {
    Either
    , error
    , success
} from '../../types';
import { ResourceError } from '../../errors';
import { getModelProvider } from './providers';
import { generateSources } from './rag';
import type {
    LLMGenerateParams
    , LLMGenerateResult
    , LLMStreamParams
} from './llm.types';

/**
 * custom error for LLM request failures
 */
class LLMRequestFailed extends ResourceError {
    public constructor () {
        const clientMessage = `Failed to get response from LLM.`;
        const code = 'LLM_REQUEST_FAILED';
        const statusCode = 500;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

/**
 * generate a text response from an LLM
 *
 * @param params - generation parameters
 * @returns Either with the generated result or error
 */
export const generateLLMText = async (
    params: LLMGenerateParams
): Promise<Either<ResourceError, LLMGenerateResult>> => {

    try {

        // get the model provider
        const model = getModelProvider( params.modelId );

        // generate sources using RAG (default: true)
        const useRAG = params.useRAG ?? true;
        const sources = useRAG ? await generateSources( params.prompt ) : [];

        // augment the prompt with search results if sources were found
        let augmentedPrompt = params.prompt;

        if ( sources.length > 0 ) {
            const sourcesContext = sources.map( ( source, index ) => {
                return `[${ index + 1 }] ${ source.title }\nURL: ${ source.url }\n${ source.description || '' }`;
            } ).join( '\n\n' );

            augmentedPrompt = `You are a helpful assistant. Use the following web search results to answer the user's question. Cite sources when relevant.

Web Search Results:
${ sourcesContext }

User Question: ${ params.prompt }

Please provide a comprehensive answer based on the search results above.`;
        }

        // generate text using the AI SDK
        const result = await generateText( {
            model
            , prompt: augmentedPrompt
            , maxOutputTokens: params.maxTokens ?? 2000
            , temperature: params.temperature ?? 0.7
        } );

        // calculate total tokens
        const inputTokens = result.usage.inputTokens ?? 0;
        const outputTokens = result.usage.outputTokens ?? 0;

        // return success with the generated text
        return success( {
            content: result.text
            , sources
            , usage: {
                inputTokens
                , outputTokens
                , totalTokens: inputTokens + outputTokens
            }
        } );

    } catch {

        // return error if something goes wrong
        return error( new LLMRequestFailed() );

    }

};

/**
 * stream a text response from an LLM
 *
 * @param params - streaming parameters
 * @returns text stream and sources
 */
export const streamLLMText = async ( params: LLMStreamParams ) => {

    // get the model provider
    const model = getModelProvider( params.modelId );

    // generate sources using RAG (default: true)
    const useRAG = params.useRAG ?? true;
    const sources = useRAG ? await generateSources( params.prompt ) : [];

    // augment the prompt with search results if sources were found
    let augmentedPrompt = params.prompt;

    if ( sources.length > 0 ) {
        const sourcesContext = sources.map( ( source, index ) => {
            return `[${ index + 1 }] ${ source.title }\nURL: ${ source.url }\n${ source.description || '' }`;
        } ).join( '\n\n' );

        augmentedPrompt = `You are a helpful assistant. Use the following web search results to answer the user's question. Cite sources when relevant.

Web Search Results:
${ sourcesContext }

User Question: ${ params.prompt }

Please provide a comprehensive answer based on the search results above.`;
    }

    // stream text using the AI SDK
    const result = streamText( {
        model
        , prompt: augmentedPrompt
        , maxOutputTokens: params.maxTokens ?? 2000
        , temperature: params.temperature ?? 0.7
    } );

    return {
        textStream: result.textStream
        , sources
    };

};
