import { gql } from 'graphile-utils';
import {
    Either
    , error
    , success
} from '../../types';
import { ResourceError } from '../../errors';
import { postGraphileRequest } from '../../lib/postGraphile';
import {
    CreateWorkflowProposalFailed
    , DeleteWorkflowProposalFailed
    , WorkflowProposalNotFound
} from './workflowProposals.errors';
import {
    CreateWorkflowProposalMutation
    , CreateWorkflowProposalMutationVariables
    , DeleteWorkflowProposalMutation
    , DeleteWorkflowProposalMutationVariables
    , GetWorkflowProposalByIdQuery
    , GetWorkflowProposalByIdQueryVariables
} from './workflowProposals.service.generatedTypes';
import {
    CreateWorkflowProposalParams
    , WorkflowProposalRecord
} from './workflowProposals.types';

/**
 * create a workflow proposal in the database
 *
 * @param params - proposal parameters
 * @returns Either<ResourceError, WorkflowProposalRecord>
 */
export const createWorkflowProposal = async (
    params: CreateWorkflowProposalParams
): Promise<Either<ResourceError, WorkflowProposalRecord>> => {

    // create the graphql mutation
    const CREATE_WORKFLOW_PROPOSAL = gql`
        mutation createWorkflowProposal(
            $workflowId: UUID!
            $baseVersionId: UUID
            $userMessage: String!
            $modelId: String
            $toolCalls: JSON!
            $proposedDag: JSON!
            $expiresAt: Datetime!
        ) {
            createWorkflowProposal(input: {
                workflowProposal: {
                    workflowId: $workflowId
                    baseVersionId: $baseVersionId
                    userMessage: $userMessage
                    modelId: $modelId
                    toolCalls: $toolCalls
                    proposedDag: $proposedDag
                    expiresAt: $expiresAt
                }
            }) {
                workflowProposal {
                    id
                    workflowId
                    baseVersionId
                    userMessage
                    modelId
                    toolCalls
                    proposedDag
                    createdAt
                    expiresAt
                }
            }
        }
    `;

    // execute the mutation
    const result = await postGraphileRequest<CreateWorkflowProposalMutation, CreateWorkflowProposalMutationVariables>( {
        mutation: CREATE_WORKFLOW_PROPOSAL
            , variables: {
                workflowId: params.workflowId
                , baseVersionId: params.baseVersionId ?? null
                , userMessage: params.userMessage
                , modelId: params.modelId ?? null
                , toolCalls: params.toolCalls
                , proposedDag: params.proposedDag
                , expiresAt: params.expiresAt
            }
    } );

    // check for error
    if ( result.isError() ) {
        return error( result.value );
    }

    // check for proposal
    if ( !result.value.createWorkflowProposal?.workflowProposal ) {
        return error( new CreateWorkflowProposalFailed() );
    }

    // return success
    return success( result.value.createWorkflowProposal.workflowProposal );

};

/**
 * get a workflow proposal by id
 *
 * @param proposalId - the proposal id
 * @returns Either<ResourceError, WorkflowProposalRecord>
 */
export const getWorkflowProposalById = async (
    proposalId: string
): Promise<Either<ResourceError, WorkflowProposalRecord>> => {

    // create the graphql query
    const GET_WORKFLOW_PROPOSAL = gql`
        query getWorkflowProposalById($proposalId: UUID!) {
            workflowProposalById(id: $proposalId) {
                id
                workflowId
                baseVersionId
                userMessage
                modelId
                toolCalls
                proposedDag
                createdAt
                expiresAt
            }
        }
    `;

    // execute the query
    const result = await postGraphileRequest<GetWorkflowProposalByIdQuery, GetWorkflowProposalByIdQueryVariables>( {
        query: GET_WORKFLOW_PROPOSAL
        , variables: { proposalId }
    } );

    // check for error
    if ( result.isError() ) {
        return error( result.value );
    }

    // check for proposal
    if ( !result.value.workflowProposalById ) {
        return error( new WorkflowProposalNotFound() );
    }

    // return success
    return success( result.value.workflowProposalById );

};

/**
 * delete a workflow proposal by id
 *
 * @param proposalId - the proposal id
 * @returns Either<ResourceError, string>
 */
export const deleteWorkflowProposalById = async (
    proposalId: string
): Promise<Either<ResourceError, string>> => {

    // create the graphql mutation
    const DELETE_WORKFLOW_PROPOSAL = gql`
        mutation deleteWorkflowProposalById($proposalId: UUID!) {
            deleteWorkflowProposalById(input: { id: $proposalId }) {
                workflowProposal {
                    id
                }
            }
        }
    `;

    // execute the mutation
    const result = await postGraphileRequest<DeleteWorkflowProposalMutation, DeleteWorkflowProposalMutationVariables>( {
        mutation: DELETE_WORKFLOW_PROPOSAL
        , variables: { proposalId }
    } );

    // check for error
    if ( result.isError() ) {
        return error( result.value );
    }

    // check for deleted proposal
    if ( !result.value.deleteWorkflowProposalById?.workflowProposal?.id ) {
        return error( new DeleteWorkflowProposalFailed() );
    }

    // return success
    return success( result.value.deleteWorkflowProposalById.workflowProposal.id );

};
