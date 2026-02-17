import { Response } from 'express';
import { ResourceError } from '../../errors';
import {
    getUserWorkflows
    , getWorkflowById
    , createWorkflow
    , updateWorkflow
    , deleteWorkflow
} from './workflows.service';
import {
    GetUserWorkflowsRequest
    , GetUserWorkflowsResponse
    , GetWorkflowByIdRequest
    , GetWorkflowByIdResponse
    , WorkflowStepResponse
    , CreateWorkflowRequest
    , CreateWorkflowResponse
    , UpdateWorkflowRequest
    , UpdateWorkflowResponse
    , DeleteWorkflowRequest
    , DeleteWorkflowResponse
    , StoredWorkflowDAG
} from './workflows.types';
import {
    sortWorkflowDagSteps
    , WorkflowStep as DagWorkflowStep
} from '../../utils/workflowDags';

/**
 * @title Get User Workflows Handler
 * @notice Returns all workflows for a user for selection in the UI.
 * @param req Express request
 * @param res Express response
 */
export const getUserWorkflowsHandler = async (
    req: GetUserWorkflowsRequest
    , res: Response<ResourceError | GetUserWorkflowsResponse>
): Promise<Response<ResourceError | GetUserWorkflowsResponse>> => {

    // get the userId from the url params
    const { userId } = req.params;

    // get the user workflows from the database
    const getUserWorkflowsResult = await getUserWorkflows( userId );

    // check for errors
    if ( getUserWorkflowsResult.isError() ) {

        // return the error
        return res
            .status( getUserWorkflowsResult.value.statusCode )
            .json( getUserWorkflowsResult.value );
    }

    // get the workflows nodes
    const workflowsNodes = getUserWorkflowsResult.value?.workflowsByUserId?.nodes ?? [];

    // map the workflows to response format, filtering out null values
    const workflows = workflowsNodes
        .filter( ( workflow ): workflow is NonNullable<typeof workflow> => workflow !== null )
        .map( workflow => {

            // get the latest version number from the workflow versions
            const latestVersion = workflow.workflowVersionsByWorkflowId?.nodes?.[ 0 ];
            const version = latestVersion?.versionNumber ?? null;

            // return the workflow in response format
            return {
                id: workflow.id
                , name: workflow.name
                , description: workflow.description ?? null
                , version
                , updatedAt: workflow.updatedAt
            };
        } );

    // return success
    return res.status( 200 ).json( { workflows } );

};

/**
 * @title Get Workflow By ID Handler
 * @notice Returns a single workflow with its full details including steps.
 * @param req Express request
 * @param res Express response
 */
export const getWorkflowByIdHandler = async (
    req: GetWorkflowByIdRequest
    , res: Response<ResourceError | GetWorkflowByIdResponse>
): Promise<Response<ResourceError | GetWorkflowByIdResponse>> => {

    // get the workflowId from the url params
    const { workflowId } = req.params;

    // get the workflow from the database
    const getWorkflowByIdResult = await getWorkflowById( workflowId );

    // check for errors
    if ( getWorkflowByIdResult.isError() ) {

        // return the error
        return res
            .status( getWorkflowByIdResult.value.statusCode )
            .json( getWorkflowByIdResult.value );
    }

    // store the workflow data
    const workflowData = getWorkflowByIdResult.value;

    // get the latest version with DAG
    const latestVersion = workflowData.workflowVersionsByWorkflowId?.nodes?.[ 0 ];
    const version = latestVersion?.versionNumber ?? null;
    const dag = latestVersion?.dag as StoredWorkflowDAG | null;

    // order the DAG steps before mapping to response format
    const orderedSteps = Array.isArray( dag?.steps )
        ? sortWorkflowDagSteps( dag.steps as unknown as DagWorkflowStep[] )
        : [];

    // map the ordered steps to response format
    const steps: WorkflowStepResponse[] = orderedSteps.map( ( step, index ) => {

        // normalize tools into a consistent response shape
        const tools = ( step.tools ?? [] ).map( ( tool: unknown ) => {
            if ( typeof tool === 'string' ) {
                return {
                    id: tool
                    , name: tool
                };
            }

            const toolObject = tool as { id?: string; name?: string; version?: string };
            return {
                id: toolObject.id ?? 'unknown'
                , name: toolObject.name ?? toolObject.id ?? 'unknown'
                , version: toolObject.version
            };
        } );

        return {
            id: step.id
            , name: step.name
            , prompt: step.instruction
            , tools
            , order: index + 1
        };
    } );

    // map the workflow to response format
    const workflow = {
        id: workflowData.id
        , name: workflowData.name
        , description: workflowData.description ?? null
        , version
        , steps
        , createdAt: workflowData.createdAt
        , updatedAt: workflowData.updatedAt
    };

    // return success
    return res.status( 200 ).json( { workflow } );

};

/**
 * @title Create Workflow Handler
 * @notice Creates a new workflow for a user.
 * @param req Express request
 * @param res Express response
 */
export const createWorkflowHandler = async (
    req: CreateWorkflowRequest
    , res: Response<ResourceError | CreateWorkflowResponse>
): Promise<Response<ResourceError | CreateWorkflowResponse>> => {

    // get the workflow data from the request body
    const { userId, name, description } = req.body;

    // create the workflow in the database
    const createWorkflowResult = await createWorkflow( {
        userId
        , name
        , description
    } );

    // check for errors
    if ( createWorkflowResult.isError() ) {

        // return the error
        return res
            .status( createWorkflowResult.value.statusCode )
            .json( createWorkflowResult.value );
    }

    // store the created workflow data
    const workflowData = createWorkflowResult.value;

    // map the workflow to response format
    const workflow = {
        id: workflowData.id
        , name: workflowData.name
        , description: workflowData.description ?? null
        , version: null
        , createdAt: workflowData.createdAt
        , updatedAt: workflowData.updatedAt
    };

    // return success
    return res.status( 201 ).json( { workflow } );

};

/**
 * @title Update Workflow Handler
 * @notice Updates an existing workflow.
 * @param req Express request
 * @param res Express response
 */
export const updateWorkflowHandler = async (
    req: UpdateWorkflowRequest
    , res: Response<ResourceError | UpdateWorkflowResponse>
): Promise<Response<ResourceError | UpdateWorkflowResponse>> => {

    // get the workflowId from the url params
    const { workflowId } = req.params;

    // get the workflow data from the request body
    const { name, description } = req.body;

    // update the workflow in the database
    const updateWorkflowResult = await updateWorkflow( {
        workflowId
        , name
        , description
    } );

    // check for errors
    if ( updateWorkflowResult.isError() ) {

        // return the error
        return res
            .status( updateWorkflowResult.value.statusCode )
            .json( updateWorkflowResult.value );
    }

    // store the updated workflow data
    const workflowData = updateWorkflowResult.value;

    // map the workflow to response format
    const workflow = {
        id: workflowData.id
        , name: workflowData.name
        , description: workflowData.description ?? null
        , updatedAt: workflowData.updatedAt
    };

    // return success
    return res.status( 200 ).json( { workflow } );

};

/**
 * @title Delete Workflow Handler
 * @notice Soft deletes a workflow by setting deletedAt timestamp.
 * @param req Express request
 * @param res Express response
 */
export const deleteWorkflowHandler = async (
    req: DeleteWorkflowRequest
    , res: Response<ResourceError | DeleteWorkflowResponse>
): Promise<Response<ResourceError | DeleteWorkflowResponse>> => {

    // get the workflowId from the url params
    const { workflowId } = req.params;

    // delete the workflow from the database
    const deleteWorkflowResult = await deleteWorkflow( workflowId );

    // check for errors
    if ( deleteWorkflowResult.isError() ) {

        // return the error
        return res
            .status( deleteWorkflowResult.value.statusCode )
            .json( deleteWorkflowResult.value );
    }

    // return success
    return res.status( 200 ).json( { success: true } );

};
