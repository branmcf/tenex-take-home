/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import { generateLLMText } from '../lib/llm';
import { generateWorkflowMetadata } from '../app/workflows/workflows.helper';
import { success } from '../types';
import { workflowMetadataDataset } from './datasets/workflow-metadata.dataset';

/* ----------------- Mocks ----------------------- */
jest.mock( '../lib/llm', () => ( { generateLLMText: jest.fn() } ) );

jest.mock( '../app/workflows/workflows.service', () => ( {
    getWorkflowMetadata: jest.fn()
    , updateWorkflowMetadata: jest.fn()
} ) );

/* ----------------- Tests ----------------------- */

ls.describe( 'Workflow metadata generation (generateWorkflowMetadata)', () => {

    beforeEach( () => {
        jest.clearAllMocks();
    } );

    workflowMetadataDataset.forEach( example => {
        ls.test(
            example.name
            , async () => {

                generateLLMText.mockResolvedValueOnce( success( { content: example.mocks?.llmContent ?? '' } ) );

                const result = await generateWorkflowMetadata( {
                    userMessage: example.inputs.userMessage
                    , modelId: example.inputs.modelId
                    , dag: { steps: [] }
                } );

                const outputs = {
                    isSuccess: result.isSuccess()
                    , name: result.value.name
                    , description: result.value.description
                    , descriptionContains: result.value.description.includes( example.expected.description )
                };

                await logAndAssertExactMatch( ls, outputs, example.expected );

            }
        );
    } );

} );
