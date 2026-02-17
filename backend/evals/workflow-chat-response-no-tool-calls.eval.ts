/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import { generateWorkflowIntent, generateWorkflowToolCalls } from '../lib/llm';
import { getWorkflowById, getLatestWorkflowVersion } from '../app/workflows/workflows.service';
import { getWorkflowChatMessages } from '../app/workflowChatMessages/workflowChatMessages.service';
import { getCachedTools } from '../app/tools/tools.helper';
import { generateWorkflowChatResponse } from '../app/workflowChatMessages/workflowChatMessages.helper';
import { success } from '../types';
import { workflowChatResponseNoToolCallsDataset } from './datasets/workflow-chat-response-no-tool-calls.dataset';

/* ----------------- Mocks ----------------------- */
jest.mock( '../lib/llm', () => ( {
    generateWorkflowIntent: jest.fn()
    , generateWorkflowToolCalls: jest.fn()
    , generateWorkflowStepToolUsage: jest.fn()
    , generateWorkflowStepPlan: jest.fn()
    , generateLLMText: jest.fn()
} ) );

jest.mock( '../app/workflows/workflows.service', () => ( {
    getWorkflowById: jest.fn()
    , getLatestWorkflowVersion: jest.fn()
} ) );

jest.mock( '../app/workflowChatMessages/workflowChatMessages.service', () => ( { getWorkflowChatMessages: jest.fn() } ) );

jest.mock( '../app/tools/tools.helper', () => ( { getCachedTools: jest.fn() } ) );

jest.mock( '../lib/workflowProposals', () => ( { storeWorkflowProposal: jest.fn() } ) );

/* ----------------- Tests ----------------------- */

ls.describe( 'Workflow chat response when no tool calls are produced', () => {

    beforeEach( () => {
        jest.clearAllMocks();

        getWorkflowById.mockResolvedValue( success( {
            id: 'workflow-1'
            , name: 'Existing Workflow'
            , description: 'Has steps'
        } ) );

        getLatestWorkflowVersion.mockResolvedValue( success( {
            id: 'version-1'
            , dag: {
                steps: [
                    {
                        id: 'step_1'
                        , name: 'Start'
                        , instruction: 'Do start.'
                        , tools: []
                        , dependsOn: []
                    }
                ]
            }
        } ) );

        getWorkflowChatMessages.mockResolvedValue( success( [] ) );
        getCachedTools.mockResolvedValue( success( [] ) );
    } );

    workflowChatResponseNoToolCallsDataset.forEach( example => {
        ls.test(
            example.name
            , async () => {

                generateWorkflowIntent.mockResolvedValueOnce( success( example.mocks.intent ) );
                generateWorkflowToolCalls.mockResolvedValueOnce( success( example.mocks.toolCalls ) );

                const result = await generateWorkflowChatResponse( {
                    workflowId: 'workflow-1'
                    , userMessage: example.inputs.userMessage
                    , modelId: example.inputs.modelId
                } );

                const outputs = {
                    success: result.isSuccess()
                    , content: result.value.content
                    , hasProposedChanges: Boolean( result.value.proposedChanges )
                };

                await logAndAssertExactMatch( ls, outputs, example.expected );

            }
        );
    } );

} );
