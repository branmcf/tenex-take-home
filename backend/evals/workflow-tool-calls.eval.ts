/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import { generateText } from 'ai';
import { generateWorkflowToolCalls } from '../lib/llm/llm.workflowIntents';
import { workflowToolCallsDataset } from './datasets/workflow-tool-calls.dataset';

/* ----------------- Mocks ----------------------- */
jest.mock( 'ai', () => ( {
    generateText: jest.fn()
    , streamText: jest.fn()
    , jsonSchema: jest.fn( () => ( {} ) )
    , tool: jest.fn( () => ( {} ) )
} ) );

jest.mock( '../lib/llm/llm.providers', () => ( { getModelProvider: jest.fn( () => ( { name: 'mock-model' } ) ) } ) );

/* ----------------- Tests ----------------------- */

ls.describe( 'Workflow tool call normalization (generateWorkflowToolCalls)', () => {

    beforeEach( () => {
        jest.clearAllMocks();
    } );

    workflowToolCallsDataset.forEach( example => {
        ls.test(
            example.name
            , async () => {

                generateText.mockResolvedValueOnce( {
                    text: example.mocks?.llmText ?? ''
                    , toolCalls: example.mocks?.toolCalls ?? []
                } );

                const result = await generateWorkflowToolCalls( {
                    userMessage: example.inputs.userMessage
                    , modelId: example.inputs.modelId
                    , workflowName: example.inputs.workflowName
                    , workflowDescription: example.inputs.workflowDescription
                    , dag: { steps: [] }
                    , availableTools: []
                    , conversationContext: null
                } );

                const outputs = {
                    isSuccess: result.isSuccess()
                    , toolCallsCount: result.value.toolCalls.length
                    , toolName: result.value.toolCalls[ 0 ]?.name ?? null
                    , toolArgName: result.value.toolCalls[ 0 ]?.args?.name ?? null
                };

                await logAndAssertExactMatch( ls, outputs, example.expected );

            }
        );
    } );

} );
