/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import { getWorkflowProposal } from '../lib/workflowProposals';
import { getLatestWorkflowVersion } from '../app/workflows/workflows.service';
import { applyWorkflowProposalHandler } from '../app/workflowChatMessages/workflowChatMessages.ctrl';
import { success, error } from '../types';
import { WorkflowProposalExpired } from '../lib/workflowProposals/workflowProposals.errors';
import { workflowProposalApplyDataset } from './datasets/workflow-proposal-apply.dataset';

/* ----------------- Mocks ----------------------- */
jest.mock( '../lib/workflowProposals', () => ( {
    getWorkflowProposal: jest.fn()
    , updateWorkflowProposalStatus: jest.fn()
} ) );

jest.mock( '../app/workflows/workflows.service', () => ( {
    getLatestWorkflowVersion: jest.fn()
    , createWorkflowVersion: jest.fn()
    , getWorkflowById: jest.fn()
} ) );

jest.mock( '../app/workflows/workflows.helper', () => ( { updateWorkflowMetadataIfAuto: jest.fn() } ) );

jest.mock( '../app/tools/tools.helper', () => ( { getCachedTools: jest.fn() } ) );

jest.mock( '../app/workflowChatMessages/workflowChatMessages.service', () => ( {
    getWorkflowChatMessages: jest.fn()
    , createWorkflowChatMessage: jest.fn()
} ) );

jest.mock( '../utils/workflowDags', () => ( {
    validateWorkflowDag: jest.fn()
    , sortWorkflowDagSteps: jest.fn( steps => steps )
} ) );

/* ----------------- Tests ----------------------- */

ls.describe( 'Workflow proposal apply handler', () => {

    const buildRes = () => {
        return {
            statusCode: 200
            , body: null
            , status ( code ) {
                this.statusCode = code;
                return this;
            }
            , json ( body ) {
                this.body = body;
                return this;
            }
        };
    };

    beforeEach( () => {
        jest.clearAllMocks();
    } );

    workflowProposalApplyDataset.forEach( example => {
        ls.test(
            example.name
            , async () => {

                if ( example.mocks?.proposalResult.type === 'expired' ) {
                    getWorkflowProposal.mockResolvedValueOnce( error( new WorkflowProposalExpired() ) );
                }

                if ( example.mocks?.proposalResult.type === 'success' ) {
                    getWorkflowProposal.mockResolvedValueOnce( success( example.mocks.proposalResult.proposal ) );
                    getLatestWorkflowVersion.mockResolvedValueOnce(
                        success( { id: example.mocks.proposalResult.latestVersionId } )
                    );
                }

                const req = {
                    params: { workflowId: example.inputs.workflowId }
                    , body: { proposalId: example.inputs.proposalId }
                };

                const res = buildRes();

                await applyWorkflowProposalHandler( req, res );

                const outputs = {
                    statusCode: res.statusCode
                    , errorCode: res.body.code
                };

                await logAndAssertExactMatch( ls, outputs, example.expected );

            }
        );
    } );

} );
