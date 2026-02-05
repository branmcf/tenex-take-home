/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import { generateText } from 'ai';
import { getWorkflowById } from '../app/workflows/workflows.service';
import { postGraphileRequest } from '../lib/postGraphile';
import { getCachedTools } from '../app/tools/tools.helper';
import { runMcpTool } from '../lib/mcpToolsServer';
import { runWorkflow } from '../lib/workflowRunner';
import { success, error } from '../types';
import { ResourceError } from '../errors';
import { workflowRunnerToolsFailureDataset } from './datasets/workflow-runner-tools-failure.dataset';

/* ----------------- Mocks ----------------------- */
jest.mock( 'ai', () => ( {
    generateText: jest.fn()
    , tool: jest.fn( config => config )
    , jsonSchema: jest.fn( schema => schema )
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

jest.mock( '../app/tools/tools.helper', () => ( {
    getCachedTools: jest.fn()
} ) );

jest.mock( '../lib/mcpToolsServer', () => ( {
    runMcpTool: jest.fn()
} ) );

/* ----------------- Tests ----------------------- */

ls.describe( 'Workflow runner tool execution (failure)', () => {

    beforeEach( () => {
        jest.clearAllMocks();
    } );

    workflowRunnerToolsFailureDataset.forEach( example => {
        ls.test(
            example.name
            , async () => {

                getWorkflowById.mockResolvedValueOnce( success( example.mocks.workflow ) );

                getCachedTools.mockResolvedValueOnce( success( example.mocks.cachedTools ) );

                runMcpTool.mockResolvedValueOnce( error( new ResourceError( {
                    message: example.mocks.toolError.message
                    , statusCode: example.mocks.toolError.statusCode
                    , code: example.mocks.toolError.code
                } ) ) );

                postGraphileRequest
                    .mockResolvedValueOnce( success( {
                        createWorkflowRun: { workflowRun: { id: 'run-1' } }
                    } ) )
                    .mockResolvedValue( success( {} ) );

                generateText.mockImplementation( async params => {
                    const toolName = Object.keys( params.tools )[ 0 ];
                    await params.tools[ toolName ].execute( { query: 'hello' } );
                    return { text: 'should not reach', toolCalls: [], toolResults: [] };
                } );

                const result = await runWorkflow( {
                    workflowId: example.inputs.workflowId
                    , chatId: example.inputs.chatId
                    , triggerMessageId: example.inputs.triggerMessageId
                    , userMessage: example.inputs.userMessage
                    , modelId: example.inputs.modelId
                } );

                const outputs = {
                    isError: result.isError()
                    , message: result.value.message
                    , toolCalled: runMcpTool.mock.calls.length > 0
                };

                await logAndAssertExactMatch( ls, outputs, example.expected );

            }
        );
    } );

} );
