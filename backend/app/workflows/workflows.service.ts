import { gql } from 'graphile-utils';
import {
    Either
    , error
    , success
} from '../../types';
import { ResourceError } from '../../errors';
import { postGraphileRequest } from '../../lib/postGraphile';
import {
    GetUserWorkflowsQuery
    , GetUserWorkflowsQueryVariables
} from './workflows.service.generatedTypes';
import {
    GetWorkflowsFailed
    , WorkflowNotFound
    , CreateWorkflowFailed
    , UpdateWorkflowFailed
    , DeleteWorkflowFailed
} from './workflows.errors';

// types for get workflow by id
interface GetWorkflowByIdQueryVariables {
    workflowId: string;
}

interface GetWorkflowByIdQuery {
    __typename: 'Query';
    workflowById?: {
        __typename: 'Workflow';
        id: string;
        name: string;
        description?: string | null;
        createdAt: string;
        updatedAt: string;
        deletedAt?: string | null;
        workflowVersionsByWorkflowId: {
            __typename: 'WorkflowVersionsConnection';
            nodes: Array<{
                __typename: 'WorkflowVersion';
                versionNumber: number;
                dag: unknown;
            } | null>;
        };
    } | null;
}

// types for create workflow
interface CreateWorkflowMutationVariables {
    userId: string;
    name: string;
    description?: string | null;
}

interface CreateWorkflowMutation {
    __typename: 'Mutation';
    createWorkflow?: {
        __typename: 'CreateWorkflowPayload';
        workflow?: {
            __typename: 'Workflow';
            id: string;
            name: string;
            description?: string | null;
            createdAt: string;
            updatedAt: string;
        } | null;
    } | null;
}

// types for update workflow
interface UpdateWorkflowMutationVariables {
    workflowId: string;
    workflowPatch: {
        name?: string;
        description?: string;
    };
}

interface UpdateWorkflowMutation {
    __typename: 'Mutation';
    updateWorkflowById?: {
        __typename: 'UpdateWorkflowPayload';
        workflow?: {
            __typename: 'Workflow';
            id: string;
            name: string;
            description?: string | null;
            updatedAt: string;
        } | null;
    } | null;
}

// types for delete workflow
interface DeleteWorkflowMutationVariables {
    workflowId: string;
}

interface DeleteWorkflowMutation {
    __typename: 'Mutation';
    updateWorkflowById?: {
        __typename: 'UpdateWorkflowPayload';
        workflow?: {
            __typename: 'Workflow';
            id: string;
            deletedAt?: string | null;
        } | null;
    } | null;
}

/**
 * get all workflows for a user from the database
 *
 * @param userId - the user id
 * @returns Either<ResourceError, GetUserWorkflowsQuery['userById']> - the user's workflows
 */
export const getUserWorkflows = async (
    userId: GetUserWorkflowsQueryVariables['userId']
): Promise<Either<ResourceError, GetUserWorkflowsQuery['userById']>> => {

    // create the graphql query
    const GET_USER_WORKFLOWS = gql`
        query getUserWorkflows($userId: String!) {
            userById(id: $userId) {
                id
                workflowsByUserId(
                    orderBy: UPDATED_AT_DESC
                    condition: { deletedAt: null }
                ) {
                    nodes {
                        id
                        name
                        description
                        updatedAt
                        workflowVersionsByWorkflowId(
                            orderBy: VERSION_NUMBER_DESC
                            first: 1
                        ) {
                            nodes {
                                versionNumber
                            }
                        }
                    }
                }
            }
        }
    `;

    // execute the graphql query
    const result = await postGraphileRequest<GetUserWorkflowsQuery, GetUserWorkflowsQueryVariables>(
        {
            query: GET_USER_WORKFLOWS
            , variables: { userId }
        }
    );

    // check for error
    if ( result.isError() ) {

        // return the error
        return error( result.value );
    }

    // check for user
    if ( !result.value.userById ) {

        // return custom error
        return error( new GetWorkflowsFailed() );
    }

    // return success
    return success( result.value.userById );

};

/**
 * get a workflow by id from the database
 *
 * @param workflowId - the workflow id
 * @returns Either<ResourceError, GetWorkflowByIdQuery['workflowById']> - the workflow
 */
export const getWorkflowById = async (
    workflowId: string
): Promise<Either<ResourceError, NonNullable<GetWorkflowByIdQuery['workflowById']>>> => {

    // create the graphql query
    const GET_WORKFLOW_BY_ID = gql`
        query getWorkflowById($workflowId: UUID!) {
            workflowById(id: $workflowId) {
                id
                name
                description
                createdAt
                updatedAt
                deletedAt
                workflowVersionsByWorkflowId(
                    orderBy: VERSION_NUMBER_DESC
                    first: 1
                ) {
                    nodes {
                        versionNumber
                        dag
                    }
                }
            }
        }
    `;

    // execute the graphql query
    const result = await postGraphileRequest<GetWorkflowByIdQuery, GetWorkflowByIdQueryVariables>(
        {
            query: GET_WORKFLOW_BY_ID
            , variables: { workflowId }
        }
    );

    // check for error
    if ( result.isError() ) {

        // return the error
        return error( result.value );
    }

    // check for workflow
    if ( !result.value.workflowById ) {

        // return custom error
        return error( new WorkflowNotFound() );
    }

    // check if workflow is deleted
    if ( result.value.workflowById.deletedAt ) {

        // return not found error for deleted workflows
        return error( new WorkflowNotFound() );
    }

    // return success
    return success( result.value.workflowById );

};

/**
 * create a new workflow in the database
 *
 * @param params - the workflow parameters
 * @returns Either<ResourceError, { id, name, description, createdAt, updatedAt }> - the created workflow
 */
export const createWorkflow = async (
    params: {
        userId: string;
        name: string;
        description?: string;
    }
): Promise<Either<ResourceError, NonNullable<NonNullable<CreateWorkflowMutation['createWorkflow']>['workflow']>>> => {

    // create the graphql mutation
    const CREATE_WORKFLOW = gql`
        mutation createWorkflow(
            $userId: String!
            $name: String!
            $description: String
        ) {
            createWorkflow(input: {
                workflow: {
                    userId: $userId
                    name: $name
                    description: $description
                }
            }) {
                workflow {
                    id
                    name
                    description
                    createdAt
                    updatedAt
                }
            }
        }
    `;

    // execute the graphql mutation
    const result = await postGraphileRequest<CreateWorkflowMutation, CreateWorkflowMutationVariables>(
        {
            mutation: CREATE_WORKFLOW
            , variables: {
                userId: params.userId
                , name: params.name
                , description: params.description ?? null
            }
        }
    );

    // check for error
    if ( result.isError() ) {

        // return the error
        return error( result.value );
    }

    // check for falsy createWorkflow
    if ( !result.value.createWorkflow?.workflow ) {

        // return custom error
        return error( new CreateWorkflowFailed() );
    }

    // return success
    return success( result.value.createWorkflow.workflow );

};

/**
 * update a workflow in the database
 *
 * @param params - the workflow update parameters
 * @returns Either<ResourceError, { id, name, description, updatedAt }> - the updated workflow
 */
export const updateWorkflow = async (
    params: {
        workflowId: string;
        name?: string;
        description?: string;
    }
): Promise<Either<ResourceError, NonNullable<NonNullable<UpdateWorkflowMutation['updateWorkflowById']>['workflow']>>> => {

    // build the patch object with only provided fields
    // omitting fields entirely (vs passing null) preserves existing values in PostGraphile
    const workflowPatch: { name?: string; description?: string } = {};
    if ( params.name !== undefined ) {
        workflowPatch.name = params.name;
    }
    if ( params.description !== undefined ) {
        workflowPatch.description = params.description;
    }

    // create the graphql mutation using JSON scalar for the patch
    const UPDATE_WORKFLOW = gql`
        mutation updateWorkflow(
            $workflowId: UUID!
            $workflowPatch: WorkflowPatch!
        ) {
            updateWorkflowById(input: {
                id: $workflowId
                workflowPatch: $workflowPatch
            }) {
                workflow {
                    id
                    name
                    description
                    updatedAt
                }
            }
        }
    `;

    // execute the graphql mutation
    const result = await postGraphileRequest<UpdateWorkflowMutation, UpdateWorkflowMutationVariables>(
        {
            mutation: UPDATE_WORKFLOW
            , variables: {
                workflowId: params.workflowId
                , workflowPatch
            }
        }
    );

    // check for error
    if ( result.isError() ) {

        // return the error
        return error( result.value );
    }

    // check for falsy updateWorkflowById
    if ( !result.value.updateWorkflowById?.workflow ) {

        // return custom error
        return error( new UpdateWorkflowFailed() );
    }

    // return success
    return success( result.value.updateWorkflowById.workflow );

};

/**
 * soft delete a workflow by setting deletedAt timestamp
 *
 * @param workflowId - the workflow id to delete
 * @returns Either<ResourceError, { success: boolean }> - success status
 */
export const deleteWorkflow = async (
    workflowId: string
): Promise<Either<ResourceError, { success: boolean }>> => {

    // first check if the workflow exists and is not already deleted
    const existingWorkflow = await getWorkflowById( workflowId );

    // if workflow not found or already deleted, return 404
    if ( existingWorkflow.isError() ) {

        // return the error (WorkflowNotFound for deleted/missing workflows)
        return error( existingWorkflow.value );
    }

    // create the graphql mutation
    const DELETE_WORKFLOW = gql`
        mutation deleteWorkflow($workflowId: UUID!) {
            updateWorkflowById(input: {
                id: $workflowId
                workflowPatch: {
                    deletedAt: "now()"
                }
            }) {
                workflow {
                    id
                    deletedAt
                }
            }
        }
    `;

    // execute the graphql mutation
    const result = await postGraphileRequest<DeleteWorkflowMutation, DeleteWorkflowMutationVariables>(
        {
            mutation: DELETE_WORKFLOW
            , variables: { workflowId }
        }
    );

    // check for error
    if ( result.isError() ) {

        // return the error
        return error( result.value );
    }

    // check for falsy updateWorkflowById
    if ( !result.value.updateWorkflowById?.workflow ) {

        // return custom error
        return error( new DeleteWorkflowFailed() );
    }

    // return success
    return success( { success: true } );

};
