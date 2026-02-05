/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import { generateText } from 'ai';
import { getWorkflowById } from '../app/workflows/workflows.service';
import { postGraphileRequest } from '../lib/postGraphile';
import { runWorkflow } from '../lib/workflowRunner';
import { success } from '../types';
import { workflowRunnerMultiStepDataset } from './datasets/workflow-runner-multi-step.dataset';

/* ----------------- Mocks ----------------------- */
jest.mock( 'ai', () => ( {
    generateText: jest.fn()
    , tool: jest.fn( () => ( {} ) )
    , jsonSchema: jest.fn( () => ( {} ) )
} ) );

jest.mock( '../lib/llm/providers', () => ( {
    getModelProvider: jest.fn( () => ( { name: 'mock-model' } ) )
} ) );

jest.mock( '../app/workflows/workflows.service', () => ( {
    getWorkflowById: jest.fn()
} ) );

jest.mock( '../lib/postGraphile', () => ( {
    postGraphileRequest: jest.fn()
} ) );

/* ----------------- Tests ----------------------- */

ls.describe( 'Workflow runner multi-step execution', () => {

    beforeEach( () => {
        jest.clearAllMocks();
    } );

    workflowRunnerMultiStepDataset.forEach( example => {
        ls.test(
            example.name
            , async () => {

                getWorkflowById.mockResolvedValueOnce( success( example.mocks.workflow ) );

                postGraphileRequest
                    .mockResolvedValueOnce( success( {
                        createWorkflowRun: { workflowRun: { id: 'run-1' } }
                    } ) )
                    .mockResolvedValue( success( {} ) );

                generateText
                    .mockResolvedValueOnce( {
                        text: example.mocks.llmTexts[ 0 ]
                        , toolCalls: []
                        , toolResults: []
                    } )
                    .mockResolvedValueOnce( {
                        text: example.mocks.llmTexts[ 1 ]
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

                const secondCallPrompt = generateText.mock.calls[ 1 ][ 0 ].prompt;
                const outputs = {
                    success: result.isSuccess()
                    , content: result.value.content
                    , promptIncludesStepLabel: secondCallPrompt.includes( 'Output from step_1' )
                    , promptIncludesOutput: secondCallPrompt.includes( example.mocks.llmTexts[ 0 ] )
                };

                await logAndAssertExactMatch( ls, outputs, example.expected );

            }
        );
    } );

} );
