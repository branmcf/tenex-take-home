/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import { generateText } from 'ai';
import { generateWorkflowStepToolUsage } from '../lib/llm/llmWithTools';
import { workflowToolUsageDataset } from './datasets/workflow-tool-usage.dataset';

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

ls.describe( 'Workflow tool usage parsing (generateWorkflowStepToolUsage)', () => {

    beforeEach( () => {
        jest.clearAllMocks();
    } );

    workflowToolUsageDataset.forEach( example => {
        ls.test(
            example.name
            , async () => {

                generateText.mockResolvedValueOnce( {
                    text: example.mocks?.llmText ?? ''
                } );

                const result = await generateWorkflowStepToolUsage( {
                    userMessage: example.inputs.userMessage
                    , modelId: 'gpt-4o'
                    , workflowName: 'Research Flow'
                    , workflowDescription: null
                    , steps: example.inputs.steps
                    , availableTools: example.inputs.availableTools
                    , conversationContext: null
                } );

                const outputs = {
                    isSuccess: result.isSuccess()
                    , isError: result.isError()
                    , stepsCount: result.isSuccess() ? result.value.steps.length : 0
                    , useTools: result.isSuccess() ? result.value.steps[ 0 ]?.useTools ?? null : null
                    , toolId: result.isSuccess() ? result.value.steps[ 0 ]?.tools?.[ 0 ]?.id ?? null : null
                    , expectedUsageByStepId: result.isSuccess()
                        ? result.value.steps.reduce<Record<string, boolean>>( ( acc, step ) => {
                            acc[ step.stepId ] = Boolean( step.useTools );
                            return acc;
                        }, {} )
                        : {}
                };

                await logAndAssertExactMatch( ls, outputs, example.expected );

            }
        );
    } );

} );
