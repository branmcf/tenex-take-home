/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import { generateText } from 'ai';
import { generateWorkflowStepPlan } from '../lib/llm/llmWithTools';
import { workflowStepPlanDataset } from './datasets/workflow-step-plan.dataset';

/* ----------------- Mocks ----------------------- */
jest.mock( 'ai', () => ( {
    generateText: jest.fn()
    , streamText: jest.fn()
    , jsonSchema: jest.fn( () => ( {} ) )
    , tool: jest.fn( () => ( {} ) )
} ) );

jest.mock( '../lib/llm/providers', () => ( {
    getModelProvider: jest.fn( () => ( { name: 'mock-model' } ) )
} ) );

/* ----------------- Tests ----------------------- */

ls.describe( 'Workflow step plan parsing (generateWorkflowStepPlan)', () => {

    beforeEach( () => {
        jest.clearAllMocks();
    } );

    workflowStepPlanDataset.forEach( example => {
        ls.test(
            example.name
            , async () => {

                generateText.mockResolvedValueOnce( {
                    text: example.mocks?.llmText ?? ''
                } );

                const result = await generateWorkflowStepPlan( {
                    userMessage: example.inputs.userMessage
                    , modelId: example.inputs.modelId
                    , workflowName: example.inputs.workflowName
                    , workflowDescription: example.inputs.workflowDescription
                    , dag: { steps: [] }
                    , conversationContext: null
                } );

                const outputs = {
                    isSuccess: result.isSuccess()
                    , isError: result.isError()
                    , stepsCount: result.isSuccess() ? result.value.steps.length : 0
                    , firstStepName: result.isSuccess() ? result.value.steps[ 0 ]?.name ?? null : null
                };

                await logAndAssertExactMatch( ls, outputs, example.expected );

            }
        );
    } );

} );
