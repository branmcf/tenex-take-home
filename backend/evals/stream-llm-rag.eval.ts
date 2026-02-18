/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import { generateText, streamText } from 'ai';
import { searchWeb } from '../lib/exa';
import { streamLLMText } from '../lib/llm/llm';
import { success } from '../types';
import { streamLlmRagDataset } from './datasets/stream-llm-rag.dataset';

/* ----------------- Mocks ----------------------- */
jest.mock( 'ai', () => ( { streamText: jest.fn(), generateText: jest.fn() } ) );

jest.mock( '../lib/exa', () => ( { searchWeb: jest.fn() } ) );

/* ----------------- Tests ----------------------- */

ls.describe( 'LLM streaming with RAG', () => {

    beforeEach( () => {
        jest.clearAllMocks();
    } );

    streamLlmRagDataset.forEach( example => {
        ls.test(
            example.name
            , async () => {

                if ( example.mocks?.sources ) {
                    searchWeb.mockResolvedValueOnce( success( example.mocks.sources ) );
                }

                if ( example.inputs.useRAG ) {
                    generateText.mockResolvedValueOnce( {
                        text: JSON.stringify( {
                            needsSearch: true
                            , reason: 'mock'
                        } )
                        , usage: { inputTokens: 0, outputTokens: 0 }
                    } );
                }

                streamText.mockReturnValueOnce( example.mocks?.streamTextResult ?? { textStream: 'mock-stream' } );

                const result = await streamLLMText( {
                    modelId: example.inputs.modelId
                    , prompt: example.inputs.prompt
                    , useRAG: example.inputs.useRAG
                } );

                const callArgs = streamText.mock.calls[ 0 ][ 0 ];

                const outputs = {
                    sourcesCount: result.sources.length
                    , promptIncludesWebSearchResults: callArgs.prompt.includes( '## Web Search Results' )
                    , promptIncludesExample: callArgs.prompt.includes( 'Example' )
                    , promptIncludesUrl: callArgs.prompt.includes( 'URL: https://example.com' )
                    , promptIncludesSummary: callArgs.prompt.includes( 'Example summary' )
                    , searchCalled: searchWeb.mock.calls.length > 0
                };

                await logAndAssertExactMatch( ls, outputs, example.expected );

            }
        );
    } );

} );
