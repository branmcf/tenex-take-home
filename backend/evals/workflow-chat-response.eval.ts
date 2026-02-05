/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import {
    generateWorkflowIntent
    , generateWorkflowToolCalls
    , generateWorkflowStepToolUsage
} from '../lib/llm';
import { applyToolCallsToDag, validateWorkflowDag } from '../lib/workflowDags';
import { getWorkflowById, getLatestWorkflowVersion } from '../app/workflows/workflows.service';
import { getWorkflowChatMessages } from '../app/workflowChatMessages/workflowChatMessages.service';
import { getCachedTools } from '../app/tools/tools.helper';
import { storeWorkflowProposal } from '../lib/workflowProposals';
import { generateWorkflowChatResponse } from '../app/workflowChatMessages/workflowChatMessages.helper';
import { success, error } from '../types';
import { workflowChatResponseDataset } from './datasets/workflow-chat-response.dataset';

/* ----------------- Mocks ----------------------- */
jest.mock( '../lib/llm', () => ( {
    generateWorkflowIntent: jest.fn()
    , generateWorkflowToolCalls: jest.fn()
    , generateWorkflowStepToolUsage: jest.fn()
    , generateWorkflowStepPlan: jest.fn()
    , generateLLMText: jest.fn()
} ) );

jest.mock( '../lib/workflowDags', () => ( {
    applyToolCallsToDag: jest.fn()
    , validateWorkflowDag: jest.fn()
} ) );

jest.mock( '../app/workflows/workflows.service', () => ( {
    getWorkflowById: jest.fn()
    , getLatestWorkflowVersion: jest.fn()
} ) );

jest.mock( '../app/workflowChatMessages/workflowChatMessages.service', () => ( {
    getWorkflowChatMessages: jest.fn()
} ) );

jest.mock( '../app/tools/tools.helper', () => ( {
    getCachedTools: jest.fn()
} ) );

jest.mock( '../lib/workflowProposals', () => ( {
    storeWorkflowProposal: jest.fn()
} ) );

/* ----------------- Tests ----------------------- */

const baseWorkflow = {
    id: 'workflow-1'
    , name: 'Test Workflow'
    , description: 'Test description'
};

const baseVersion = {
    id: 'version-1'
    , dag: { steps: [] }
};

ls.describe( 'Workflow chat response generation', () => {

    beforeEach( () => {
        jest.clearAllMocks();

        getWorkflowById.mockResolvedValue( success( baseWorkflow ) );
        getLatestWorkflowVersion.mockResolvedValue( success( baseVersion ) );
        getWorkflowChatMessages.mockResolvedValue( success( [] ) );
        getCachedTools.mockResolvedValue( success( [] ) );
    } );

    workflowChatResponseDataset.forEach( example => {
        ls.test(
            example.name
            , async () => {

                generateWorkflowIntent.mockResolvedValueOnce( success( example.mocks.intent ) );

                if ( example.mocks.toolCalls ) {
                    generateWorkflowToolCalls.mockResolvedValueOnce( success( example.mocks.toolCalls ) );
                }

                if ( example.mocks.appliedDag ) {
                    applyToolCallsToDag.mockReturnValue( success( example.mocks.appliedDag ) );
                }

                if ( example.mocks.proposal ) {
                    storeWorkflowProposal.mockResolvedValueOnce( success( example.mocks.proposal ) );
                }

                generateWorkflowStepToolUsage.mockResolvedValueOnce( error( { message: 'force no tools' } ) );
                validateWorkflowDag.mockReturnValue( success( undefined ) );

                const result = await generateWorkflowChatResponse( {
                    workflowId: 'workflow-1'
                    , userMessage: example.inputs.userMessage
                    , modelId: example.inputs.modelId
                } );

                const outputs = {
                    success: result.isSuccess()
                    , content: result.value.content
                    , hasProposedChanges: Boolean( result.value.proposedChanges )
                    , previewStepsCount: result.value.proposedChanges?.previewSteps?.length ?? 0
                    , contentIncludesReview: result.value.content.includes( 'Review the proposed changes' )
                };

                await logAndAssertExactMatch( ls, outputs, example.expected );

            }
        );
    } );

} );
