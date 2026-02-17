/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import { generateText } from 'ai';
import { getWorkflowById } from '../app/workflows/workflows.service';
import { postGraphileRequest } from '../lib/postGraphile';
import { getCachedTools } from '../app/tools/tools.helper';
import { runMcpTool } from '../lib/mcpToolsServer';
import { runWorkflow } from '../lib/workflowRunner';
import { success } from '../types';
import { workflowRunnerToolsSuccessDataset } from './datasets/workflow-runner-tools-success.dataset';

/* ----------------- Mocks ----------------------- */
jest.mock( 'ai', () => ( {
    generateText: jest.fn()
    , tool: jest.fn( config => config )
    , jsonSchema: jest.fn( schema => schema )
} ) );

jest.mock( '../lib/llm/llm.providers', () => ( { getModelProvider: jest.fn( () => ( { name: 'mock-model' } ) ) } ) );

jest.mock( '../app/workflows/workflows.service', () => ( { getWorkflowById: jest.fn() } ) );

jest.mock( '../lib/postGraphile', () => ( { postGraphileRequest: jest.fn() } ) );

jest.mock( '../app/tools/tools.helper', () => ( { getCachedTools: jest.fn() } ) );

jest.mock( '../lib/mcpToolsServer', () => ( { runMcpTool: jest.fn() } ) );

/* ----------------- Tests ----------------------- */

ls.describe( 'Workflow runner tool execution (success)', () => {

    beforeEach( () => {
        jest.clearAllMocks();
    } );

    workflowRunnerToolsSuccessDataset.forEach( example => {
        ls.test(
            example.name
            , async () => {

                getWorkflowById.mockResolvedValueOnce( success( example.mocks.workflow ) );

                getCachedTools.mockResolvedValueOnce( success( example.mocks.cachedTools ) );

                runMcpTool.mockResolvedValueOnce( success( { output: example.mocks.toolOutput } ) );

                postGraphileRequest
                    .mockResolvedValueOnce( success( { createWorkflowRun: { workflowRun: { id: 'run-1' } } } ) )
                    .mockResolvedValue( success( {} ) );

                generateText.mockImplementation( async params => {
                    if ( params.tools ) {
                        const toolName = Object.keys( params.tools )[ 0 ];
                        await params.tools[ toolName ].execute( { query: 'hello' } );
                        return {
                            text: 'Final output'
                            , toolCalls: [ { toolCallId: 'call-1', toolName } ]
                            , toolResults: []
                        };
                    }

                    return { text: 'Final output', toolCalls: [], toolResults: [] };
                } );

                const result = await runWorkflow( {
                    workflowId: example.inputs.workflowId
                    , chatId: example.inputs.chatId
                    , triggerMessageId: example.inputs.triggerMessageId
                    , userMessage: example.inputs.userMessage
                    , modelId: example.inputs.modelId
                } );

                const toolCall = runMcpTool.mock.calls[ 0 ]?.[ 0 ] ?? null;
                const outputs = {
                    success: result.isSuccess()
                    , content: result.value.content
                    , toolCall
                };

                await logAndAssertExactMatch( ls, outputs, example.expected );

            }
        );
    } );

} );
