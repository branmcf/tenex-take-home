/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import {
    getWorkflowProposalById
    , updateWorkflowProposalStatus
    , getWorkflowProposalsByWorkflowId
} from '../lib/workflowProposals/workflowProposals.service';
import { getWorkflowProposal, getLatestWorkflowProposalForWorkflow } from '../lib/workflowProposals/workflowProposals.helper';
import { success } from '../types';
import { workflowProposalsExpirationDataset } from './datasets/workflow-proposals-expiration.dataset';

/* ----------------- Mocks ----------------------- */
jest.mock( '../lib/workflowProposals/workflowProposals.service', () => ( {
    getWorkflowProposalById: jest.fn()
    , updateWorkflowProposalStatus: jest.fn()
    , getWorkflowProposalsByWorkflowId: jest.fn()
} ) );

/* ----------------- Tests ----------------------- */

ls.describe( 'Workflow proposal expiration handling', () => {

    beforeEach( () => {
        jest.clearAllMocks();
    } );

    workflowProposalsExpirationDataset.forEach( example => {
        ls.test(
            example.name
            , async () => {

                if ( example.inputs.proposalById ) {
                    getWorkflowProposalById.mockResolvedValueOnce( success( example.inputs.proposalById ) );
                    updateWorkflowProposalStatus.mockResolvedValueOnce( success( undefined ) );

                    const result = await getWorkflowProposal( example.inputs.proposalById.id );

                    const outputs = {
                        isError: result.isError()
                        , code: result.value.code
                        , expiredMarked: updateWorkflowProposalStatus.mock.calls.length > 0
                    };

                    const filteredOutputs = Object.keys( example.expected ).reduce<Record<string, unknown>>( ( acc, key ) => {
                        acc[ key ] = outputs[ key as keyof typeof outputs ];
                        return acc;
                    }, {} );

                    await logAndAssertExactMatch( ls, filteredOutputs, example.expected );

                    return;
                }

                getWorkflowProposalsByWorkflowId.mockResolvedValueOnce( success( example.inputs.proposals ?? [] ) );
                updateWorkflowProposalStatus.mockResolvedValueOnce( success( undefined ) );

                const result = await getLatestWorkflowProposalForWorkflow( 'workflow-1' );

                const outputs = {
                    isSuccess: result.isSuccess()
                    , proposalId: result.isSuccess() ? result.value.id : null
                    , expiredMarked: updateWorkflowProposalStatus.mock.calls.length > 0
                };

                const filteredOutputs = Object.keys( example.expected ).reduce<Record<string, unknown>>( ( acc, key ) => {
                    acc[ key ] = outputs[ key as keyof typeof outputs ];
                    return acc;
                }, {} );

                await logAndAssertExactMatch( ls, filteredOutputs, example.expected );

            }
        );
    } );

} );
