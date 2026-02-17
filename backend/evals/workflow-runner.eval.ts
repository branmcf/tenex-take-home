/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import { generateText } from 'ai';
import { getWorkflowById } from '../app/workflows/workflows.service';
import { postGraphileRequest } from '../lib/postGraphile';
import { runWorkflow } from '../lib/workflowRunner';
import { success } from '../types';
import { workflowRunnerDataset } from './datasets/workflow-runner.dataset';

/* ----------------- Mocks ----------------------- */
jest.mock( 'ai', () => ( {
    generateText: jest.fn()
    , tool: jest.fn( () => ( {} ) )
    , jsonSchema: jest.fn( () => ( {} ) )
} ) );

jest.mock( '../lib/llm/llm.providers', () => ( { getModelProvider: jest.fn( () => ( { name: 'mock-model' } ) ) } ) );

jest.mock( '../app/workflows/workflows.service', () => ( { getWorkflowById: jest.fn() } ) );

jest.mock( '../lib/postGraphile', () => ( { postGraphileRequest: jest.fn() } ) );

/* ----------------- Tests ----------------------- */

ls.describe( 'Workflow runner (runWorkflow)', () => {

    beforeEach( () => {
        jest.clearAllMocks();
    } );

    workflowRunnerDataset.forEach( example => {
        ls.test(
            example.name
            , async () => {

                getWorkflowById.mockResolvedValueOnce( success( example.mocks.workflow ) );

                postGraphileRequest
                    .mockResolvedValueOnce( success( { createWorkflowRun: { workflowRun: { id: 'run-1' } } } ) )
                    .mockResolvedValue( success( {} ) );

                generateText.mockResolvedValueOnce( {
                    text: example.mocks.llmText
                    , toolCalls: []
                    , toolResults: []
                } );

                const result = await runWorkflow( {
                    workflowId: example.inputs.workflowId
                    , chatId: example.inputs.chatId
                    , triggerMessageId: example.inputs.triggerMessageId
                    , userMessage: example.inputs.userMessage
                    , modelId: example.inputs.modelId
                } );

                const outputs = {
                    success: result.isSuccess()
                    , content: result.value.content
                    , generateCalled: generateText.mock.calls.length > 0
                };

                await logAndAssertExactMatch( ls, outputs, example.expected );

            }
        );
    } );

} );
