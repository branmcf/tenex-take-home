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
    , ChatHistoryMessage
    , SearchClassificationResult
} from './llm.types';
import {
    buildSearchClassificationPrompt
    , buildChatSystemPrompt
    , formatSourcesForRAGPrompt
    , formatConversationHistoryForPrompt
} from '../../utils/constants';

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
 * Format conversation history for context
 */
const formatHistoryForContext = ( history: ChatHistoryMessage[] ): string => {
    if ( !history || history.length === 0 ) {
        return '';
    }

    return formatConversationHistoryForPrompt(
        history.map( msg => ( { role: msg.role, content: msg.content } ) )
    );
};

/**
 * Classify whether a query needs web search
 *
 * @param params - classification parameters
 * @returns classification result
 */
const classifySearchNeed = async (
    params: {
        modelId: string;
        userMessage: string;
        conversationContext?: string | null;
    }
): Promise<SearchClassificationResult> => {

    try {
        const model = getModelProvider( params.modelId );

        const prompt = buildSearchClassificationPrompt( {
            userMessage: params.userMessage
            , conversationContext: params.conversationContext
        } );

        const result = await generateText( {
            model
            , prompt
            , maxOutputTokens: 100
            , temperature: 0.1
            , experimental_telemetry: {
                isEnabled: true
                , functionId: 'classifySearchNeed'
                , metadata: {
                    modelId: params.modelId
                }
            }
        } );

        // parse the JSON response
        const text = result.text.trim();

        try {
            const parsed = JSON.parse( text );
            return {
                needsSearch: Boolean( parsed.needsSearch )
                , reason: parsed.reason ?? 'unknown'
            };
        } catch {
            // if parsing fails, default to search (safer)
            return {
                needsSearch: true
                , reason: 'classification parsing failed, defaulting to search'
            };
        }
    } catch {
        // if classification fails, default to search (safer)
        return {
            needsSearch: true
            , reason: 'classification failed, defaulting to search'
        };
    }
};

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

        // build conversation context from history
        const conversationContext = params.conversationHistory
            ? formatHistoryForContext( params.conversationHistory )
            : null;

        // determine if RAG is enabled and if search is actually needed
        const useRAG = params.useRAG ?? true;
        let searchPerformed = false;
        let sources: Awaited<ReturnType<typeof generateSources>> = [];

        if ( useRAG ) {
            // classify if search is needed based on query and conversation
            const classification = await classifySearchNeed( {
                modelId: params.modelId
                , userMessage: params.prompt
                , conversationContext
            } );

            if ( classification.needsSearch ) {
                sources = await generateSources( params.prompt );
                searchPerformed = true;
            }
        }

        // build the full prompt with conversation context and sources
        const sourcesContext = sources.length > 0
            ? formatSourcesForRAGPrompt( sources )
            : null;

        const fullPrompt = buildChatSystemPrompt( {
            userMessage: params.prompt
            , conversationContext
            , sourcesContext
        } );

        // generate text using the AI SDK
        const result = await generateText( {
            model
            , prompt: fullPrompt
            , maxOutputTokens: params.maxTokens ?? 2000
            , temperature: params.temperature ?? 0.7
            , experimental_telemetry: {
                isEnabled: true
                , functionId: 'generateLLMText'
                , metadata: {
                    modelId: params.modelId
                    , useRAG: String( useRAG )
                    , searchPerformed: String( searchPerformed )
                    , sourcesCount: String( sources.length )
                    , hasConversationHistory: String( !!conversationContext )
                }
            }
        } );

        // calculate total tokens
        const inputTokens = result.usage.inputTokens ?? 0;
        const outputTokens = result.usage.outputTokens ?? 0;

        // return success with the generated text
        return success( {
            content: result.text
            , sources
            , searchPerformed
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
 * @returns text stream, sources, and whether search was performed
 */
export const streamLLMText = async ( params: LLMStreamParams ) => {

    // get the model provider
    const model = getModelProvider( params.modelId );

    // build conversation context from history
    const conversationContext = params.conversationHistory
        ? formatHistoryForContext( params.conversationHistory )
        : null;

    // determine if RAG is enabled and if search is actually needed
    const useRAG = params.useRAG ?? true;
    let searchPerformed = false;
    let sources: Awaited<ReturnType<typeof generateSources>> = [];

    if ( useRAG ) {
        // classify if search is needed based on query and conversation
        const classification = await classifySearchNeed( {
            modelId: params.modelId
            , userMessage: params.prompt
            , conversationContext
        } );

        if ( classification.needsSearch ) {
            sources = await generateSources( params.prompt );
            searchPerformed = true;
        }
    }

    // build the full prompt with conversation context and sources
    const sourcesContext = sources.length > 0
        ? formatSourcesForRAGPrompt( sources )
        : null;

    const fullPrompt = buildChatSystemPrompt( {
        userMessage: params.prompt
        , conversationContext
        , sourcesContext
    } );

    // stream text using the AI SDK
    const result = streamText( {
        model
        , prompt: fullPrompt
        , maxOutputTokens: params.maxTokens ?? 2000
        , temperature: params.temperature ?? 0.7
        , experimental_telemetry: {
            isEnabled: true
            , functionId: 'streamLLMText'
            , metadata: {
                modelId: params.modelId
                , useRAG: String( useRAG )
                , searchPerformed: String( searchPerformed )
                , sourcesCount: String( sources.length )
                , hasConversationHistory: String( !!conversationContext )
            }
        }
    } );

    return {
        textStream: result.textStream
        , sources
        , searchPerformed
    };

};
