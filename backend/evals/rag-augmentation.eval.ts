/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import { generateText } from 'ai';
import { searchWeb } from '../lib/exa';
import { generateLLMText } from '../lib/llm';
import { success } from '../types';
import { ragAugmentationDataset } from './datasets/rag-augmentation.dataset';

/* ----------------- Mocks ----------------------- */
jest.mock( 'ai', () => ( {
    generateText: jest.fn()
    , streamText: jest.fn()
    , jsonSchema: jest.fn( () => ( {} ) )
    , tool: jest.fn( () => ( {} ) )
} ) );

jest.mock( '../lib/exa', () => ( {
    searchWeb: jest.fn()
} ) );

/* ----------------- Tests ----------------------- */

ls.describe( 'RAG augmentation (generateLLMText)', () => {

    beforeEach( () => {
        jest.clearAllMocks();
    } );

    ragAugmentationDataset.forEach( example => {
        ls.test(
            example.name
            , async () => {

                if ( example.mocks?.sources ) {
                    searchWeb.mockResolvedValueOnce( success( example.mocks.sources ) );
                }

                generateText.mockResolvedValueOnce( example.mocks?.llmResponse ?? {
                    text: ''
                    , usage: { inputTokens: 0, outputTokens: 0 }
                } );

                const result = await generateLLMText( {
                    modelId: example.inputs.modelId
                    , prompt: example.inputs.prompt
                    , useRAG: example.inputs.useRAG
                } );

                const callArgs = generateText.mock.calls[ 0 ][ 0 ];
                const sources = result.isSuccess() ? result.value.sources : [];

                const outputs = {
                    success: result.isSuccess()
                    , sourcesCount: sources.length
                    , firstSourceUrl: sources[ 0 ]?.url ?? null
                    , promptIncludesWebSearchResults: callArgs.prompt.includes( 'Web Search Results:' )
                    , promptIncludesExampleA: callArgs.prompt.includes( 'Example A' )
                    , promptIncludesUrl: callArgs.prompt.includes( 'URL: https://example.com/a' )
                    , promptIncludesSummary: callArgs.prompt.includes( 'Summary A' )
                    , totalTokens: result.isSuccess() ? result.value.usage.totalTokens : 0
                    , searchCalled: searchWeb.mock.calls.length > 0
                };

                await logAndAssertExactMatch( ls, outputs, example.expected );

            }
        );
    } );

} );
