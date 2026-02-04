import {
    Either
    , error
    , success
} from '../../types';
import { ResourceError } from '../../errors';
import {
    CreateWorkflowProposalParams
    , WorkflowProposalRecord
} from './workflowProposals.types';
import {
    createWorkflowProposal
    , deleteWorkflowProposalById
    , getWorkflowProposalById
} from './workflowProposals.service';
import {
    WorkflowProposalExpired
} from './workflowProposals.errors';

const isExpired = ( expiresAt: string ) => {
    const now = Date.now();
    const expiry = new Date( expiresAt ).getTime();
    return Number.isNaN( expiry ) || expiry <= now;
};

/**
 * store a workflow proposal
 *
 * @param params - proposal params
 * @returns Either<ResourceError, WorkflowProposalRecord>
 */
export const storeWorkflowProposal = async (
    params: CreateWorkflowProposalParams
): Promise<Either<ResourceError, WorkflowProposalRecord>> => {

    // create the proposal in the database
    const createResult = await createWorkflowProposal( params );

    if ( createResult.isError() ) {
        return error( createResult.value );
    }

    return success( createResult.value );

};

/**
 * get a workflow proposal and verify expiration
 *
 * @param proposalId - proposal id
 * @returns Either<ResourceError, WorkflowProposalRecord>
 */
export const getWorkflowProposal = async (
    proposalId: string
): Promise<Either<ResourceError, WorkflowProposalRecord>> => {

    const getResult = await getWorkflowProposalById( proposalId );

    if ( getResult.isError() ) {
        return error( getResult.value );
    }

    if ( isExpired( getResult.value.expiresAt ) ) {
        await deleteWorkflowProposalById( proposalId );
        return error( new WorkflowProposalExpired() );
    }

    return success( getResult.value );

};

/**
 * delete a workflow proposal
 *
 * @param proposalId - proposal id
 * @returns Either<ResourceError, string>
 */
export const removeWorkflowProposal = async (
    proposalId: string
): Promise<Either<ResourceError, string>> => {

    const deleteResult = await deleteWorkflowProposalById( proposalId );

    if ( deleteResult.isError() ) {
        return error( deleteResult.value );
    }

    return success( deleteResult.value );

};
