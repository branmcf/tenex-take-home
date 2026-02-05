/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import { generateText } from 'ai';
import { generateLLMText } from '../lib/llm/llm';
import { llmErrorHandlingDataset } from './datasets/llm-error-handling.dataset';

/* ----------------- Mocks ----------------------- */
jest.mock( 'ai', () => ( {
    generateText: jest.fn()
    , streamText: jest.fn()
    , jsonSchema: jest.fn( () => ( {} ) )
    , tool: jest.fn( () => ( {} ) )
} ) );

/* ----------------- Tests ----------------------- */

ls.describe( 'LLM error handling', () => {

    beforeEach( () => {
        jest.clearAllMocks();
    } );

    llmErrorHandlingDataset.forEach( example => {
        ls.test(
            example.name
            , async () => {

                generateText.mockRejectedValueOnce( new Error( example.mocks?.errorMessage ?? 'boom' ) );

                const result = await generateLLMText( {
                    modelId: example.inputs.modelId
                    , prompt: example.inputs.prompt
                    , useRAG: example.inputs.useRAG
                } );

                const outputs = {
                    isError: result.isError()
                    , code: result.value.code
                    , statusCode: result.value.statusCode
                };

                await logAndAssertExactMatch( ls, outputs, example.expected );

            }
        );
    } );

} );
