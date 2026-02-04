import { gql } from 'graphile-utils';
import {
    Either
    , error
    , success
} from '../../types';
import { ResourceError } from '../../errors';
import { postGraphileRequest } from '../../lib/postGraphile';
import {
    CreateWorkflowMutation
    , CreateWorkflowMutationVariables
    , CreateWorkflowVersionMutation
    , CreateWorkflowVersionMutationVariables
    , DeleteWorkflowMutation
    , DeleteWorkflowMutationVariables
    , GetLatestWorkflowVersionQuery
    , GetLatestWorkflowVersionQueryVariables
    , GetUserWorkflowsQuery
    , GetUserWorkflowsQueryVariables
    , GetWorkflowByIdQuery
    , GetWorkflowByIdQueryVariables
    , GetWorkflowMetadataQuery
    , GetWorkflowMetadataQueryVariables
    , GetWorkflowOwnershipQuery
    , GetWorkflowOwnershipQueryVariables
    , UpdateWorkflowMetadataMutation
    , UpdateWorkflowMetadataMutationVariables
    , UpdateWorkflowMutation
    , UpdateWorkflowMutationVariables
} from './workflows.service.generatedTypes';
import {
    GetWorkflowsFailed
    , WorkflowNotFound
    , CreateWorkflowFailed
    , UpdateWorkflowFailed
    , DeleteWorkflowFailed
} from './workflows.errors';

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
                nameSource
                descriptionSource
                createdAt
                updatedAt
                deletedAt
                workflowVersionsByWorkflowId(
                    orderBy: VERSION_NUMBER_DESC
                    first: 1
                ) {
                    nodes {
                        id
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
 * get workflow metadata (name/description sources) by id
 *
 * @param workflowId - the workflow id
 * @returns Either<ResourceError, metadata> - workflow metadata
 */
export const getWorkflowMetadata = async (
    workflowId: string
): Promise<Either<ResourceError, { id: string; name: string; description: string | null; nameSource: 'auto' | 'user'; descriptionSource: 'auto' | 'user' }>> => {

    // create the graphql query
    const GET_WORKFLOW_METADATA = gql`
        query getWorkflowMetadata($workflowId: UUID!) {
            workflowById(id: $workflowId) {
                id
                name
                description
                nameSource
                descriptionSource
            }
        }
    `;

    // execute the graphql query
    const result = await postGraphileRequest<GetWorkflowMetadataQuery, GetWorkflowMetadataQueryVariables>(
        {
            query: GET_WORKFLOW_METADATA
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

    // return success
    return success( {
        id: result.value.workflowById.id
        , name: result.value.workflowById.name
        , description: result.value.workflowById.description ?? null
        , nameSource: ( result.value.workflowById.nameSource ?? 'auto' ) as 'auto' | 'user'
        , descriptionSource: ( result.value.workflowById.descriptionSource ?? 'auto' ) as 'auto' | 'user'
    } );

};

/**
 * update workflow metadata fields
 *
 * @param workflowId - the workflow id
 * @param workflowPatch - metadata patch
 * @returns Either<ResourceError, { id }>\n */
export const updateWorkflowMetadata = async (
    workflowId: string
    , workflowPatch: { name?: string; description?: string; nameSource?: 'auto' | 'user'; descriptionSource?: 'auto' | 'user' }
): Promise<Either<ResourceError, { id: string }>> => {

    // create the graphql mutation
    const UPDATE_WORKFLOW_METADATA = gql`
        mutation updateWorkflowMetadata($workflowId: UUID!, $workflowPatch: WorkflowPatch!) {
            updateWorkflowById(input: { id: $workflowId, workflowPatch: $workflowPatch }) {
                workflow {
                    id
                }
            }
        }
    `;

    // execute the graphql mutation
    const result = await postGraphileRequest<UpdateWorkflowMetadataMutation, UpdateWorkflowMetadataMutationVariables>(
        {
            mutation: UPDATE_WORKFLOW_METADATA
            , variables: {
                workflowId
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
    return success( {
        id: result.value.updateWorkflowById.workflow.id
    } );

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
            $nameSource: String
            $descriptionSource: String
        ) {
            createWorkflow(input: {
                workflow: {
                    userId: $userId
                    name: $name
                    description: $description
                    nameSource: $nameSource
                    descriptionSource: $descriptionSource
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
                , nameSource: 'auto'
                , descriptionSource: 'auto'
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
    const workflowPatch: { name?: string; description?: string; nameSource?: string; descriptionSource?: string } = {};
    if ( params.name !== undefined ) {
        workflowPatch.name = params.name;
        workflowPatch.nameSource = 'user';
    }
    if ( params.description !== undefined ) {
        workflowPatch.description = params.description;
        workflowPatch.descriptionSource = 'user';
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

/**
 * get the latest workflow version for a workflow
 *
 * @param workflowId - workflow id
 * @returns Either<ResourceError, { id, versionNumber, dag } | null>\n */
export const getLatestWorkflowVersion = async (
    workflowId: string
): Promise<Either<ResourceError, { id: string; versionNumber: number; dag: unknown } | null>> => {

    const GET_LATEST_WORKFLOW_VERSION = gql`
        query getLatestWorkflowVersion($workflowId: UUID!) {
            workflowById(id: $workflowId) {
                id
                workflowVersionsByWorkflowId(orderBy: VERSION_NUMBER_DESC, first: 1) {
                    nodes {
                        id
                        versionNumber
                        dag
                    }
                }
            }
        }
    `;

    const result = await postGraphileRequest<GetLatestWorkflowVersionQuery, GetLatestWorkflowVersionQueryVariables>(
        {
            query: GET_LATEST_WORKFLOW_VERSION
            , variables: { workflowId }
        }
    );

    if ( result.isError() ) {
        return error( result.value );
    }

    if ( !result.value.workflowById ) {
        return error( new WorkflowNotFound() );
    }

    const latestNode = result.value.workflowById.workflowVersionsByWorkflowId.nodes[ 0 ] ?? null;

    if ( !latestNode ) {
        return success( null );
    }

    return success( {
        id: latestNode.id
        , versionNumber: latestNode.versionNumber
        , dag: latestNode.dag
    } );

};

/**
 * create a new workflow version
 *
 * @param workflowId - workflow id
 * @param dag - workflow dag
 * @returns Either<ResourceError, { id, versionNumber, dag }>\n */
export const createWorkflowVersion = async (
    workflowId: string
    , dag: unknown
): Promise<Either<ResourceError, { id: string; versionNumber: number; dag: unknown }>> => {

    // get the latest version to increment
    const latestResult = await getLatestWorkflowVersion( workflowId );

    if ( latestResult.isError() ) {
        return error( latestResult.value );
    }

    const nextVersionNumber = ( latestResult.value?.versionNumber ?? 0 ) + 1;

    // create the graphql mutation
    const CREATE_WORKFLOW_VERSION = gql`
        mutation createWorkflowVersion($workflowId: UUID!, $versionNumber: Int!, $dag: JSON!) {
            createWorkflowVersion(input: {
                workflowVersion: {
                    workflowId: $workflowId
                    versionNumber: $versionNumber
                    dag: $dag
                }
            }) {
                workflowVersion {
                    id
                    versionNumber
                    dag
                    createdAt
                }
            }
        }
    `;

    const result = await postGraphileRequest<CreateWorkflowVersionMutation, CreateWorkflowVersionMutationVariables>(
        {
            mutation: CREATE_WORKFLOW_VERSION
            , variables: {
                workflowId
                , versionNumber: nextVersionNumber
                , dag
            }
        }
    );

    if ( result.isError() ) {
        return error( result.value );
    }

    if ( !result.value.createWorkflowVersion?.workflowVersion ) {
        return error( new UpdateWorkflowFailed() );
    }

    return success( {
        id: result.value.createWorkflowVersion.workflowVersion.id
        , versionNumber: result.value.createWorkflowVersion.workflowVersion.versionNumber
        , dag: result.value.createWorkflowVersion.workflowVersion.dag
    } );

};

/**
 * get workflow ownership info by workflow id
 *
 * @param workflowId - the workflow id
 * @returns Either<ResourceError, { id, userId }> - the workflow with userId
 */
export const getWorkflowOwnership = async (
    workflowId: GetWorkflowOwnershipQueryVariables['workflowId']
): Promise<Either<ResourceError, { id: string; userId: string }>> => {

    // create the graphql query
    const GET_WORKFLOW_OWNERSHIP = gql`
        query getWorkflowOwnership($workflowId: UUID!) {
            workflowById(id: $workflowId) {
                id
                userId
                deletedAt
            }
        }
    `;

    // execute the graphql query
    const result = await postGraphileRequest<GetWorkflowOwnershipQuery, GetWorkflowOwnershipQueryVariables>(
        {
            query: GET_WORKFLOW_OWNERSHIP
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
    return success( {
        id: result.value.workflowById.id
        , userId: result.value.workflowById.userId
    } );

};
