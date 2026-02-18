import { generateText, streamText } from 'ai';
import {
    Either
    , error
    , success
} from '../../types';
import { ResourceError } from '../../errors';
import { getModelProvider } from './llm.providers';
import { generateSources, needsWebSearch } from './llm.rag';
import type {
    LLMGenerateParams
    , LLMGenerateResult
    , LLMStreamParams
    , LLMStreamResult
    , ChatHistoryMessage
    , SearchClassificationResult
} from './llm.types';
import { LLMRequestFailed } from './llm.errors';
import {
    buildSearchClassificationPrompt
    , buildChatSystemPrompt
    , formatSourcesForRAGPrompt
    , formatConversationHistoryForPrompt
} from '../../utils/constants';

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
            // eslint-disable-next-line @typescript-eslint/naming-convention
            , experimental_telemetry: {
                isEnabled: true
                , functionId: 'classifySearchNeed'
                , metadata: { modelId: params.modelId }
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

        if ( useRAG && needsWebSearch( params.prompt ) ) {
            // heuristic passed, now confirm with LLM classifier
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
            , maxOutputTokens: params.maxTokens ?? 10000
            , temperature: params.temperature ?? 0.7
            // eslint-disable-next-line @typescript-eslint/naming-convention
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
export const streamLLMText = async ( params: LLMStreamParams ): Promise<LLMStreamResult> => {

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

    if ( useRAG && needsWebSearch( params.prompt ) ) {
        // heuristic passed, now confirm with LLM classifier
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
        , maxOutputTokens: params.maxTokens ?? 10000
        , temperature: params.temperature ?? 0.7
        // eslint-disable-next-line @typescript-eslint/naming-convention
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
