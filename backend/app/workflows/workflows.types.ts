import { Request } from 'express';

/**
 * request type for getting user's workflows
 */
export interface GetUserWorkflowsRequest extends Request {
    params: {
        userId: string;
    };
}

/**
 * individual workflow in the response
 * includes all fields needed by both the chat modal and workflows list view
 */
export interface WorkflowResponse {
    id: string;
    name: string;
    description: string | null;
    version: number | null;
    updatedAt: string;
}

/**
 * response type for getting user's workflows
 */
export interface GetUserWorkflowsResponse {
    workflows: WorkflowResponse[];
}

/**
 * request type for getting a workflow by id
 */
export interface GetWorkflowByIdRequest extends Request {
    params: {
        workflowId: string;
    };
}

/**
 * tool in a workflow step
 */
export interface WorkflowToolResponse {
    id: string;
    name: string;
    description?: string;
}

/**
 * step in a workflow
 */
export interface WorkflowStepResponse {
    id: string;
    name: string;
    prompt: string;
    tools: WorkflowToolResponse[];
    order: number;
}

/**
 * full workflow detail response
 */
export interface WorkflowDetailResponse {
    id: string;
    name: string;
    description: string | null;
    version: number | null;
    steps: WorkflowStepResponse[];
    createdAt: string;
    updatedAt: string;
}

/**
 * response type for getting a workflow by id
 */
export interface GetWorkflowByIdResponse {
    workflow: WorkflowDetailResponse;
}

/**
 * request type for creating a workflow
 */
export interface CreateWorkflowRequest extends Request {
    body: {
        userId: string;
        name: string;
        description?: string;
    };
}

/**
 * response type for creating a workflow
 */
export interface CreateWorkflowResponse {
    workflow: {
        id: string;
        name: string;
        description: string | null;
        version: number | null;
        createdAt: string;
        updatedAt: string;
    };
}

/**
 * request type for updating a workflow
 */
export interface UpdateWorkflowRequest extends Request {
    params: {
        workflowId: string;
    };
    body: {
        name?: string;
        description?: string;
    };
}

/**
 * response type for updating a workflow
 */
export interface UpdateWorkflowResponse {
    workflow: {
        id: string;
        name: string;
        description: string | null;
        updatedAt: string;
    };
}

/**
 * request type for deleting a workflow
 */
export interface DeleteWorkflowRequest extends Request {
    params: {
        workflowId: string;
    };
}

/**
 * response type for deleting a workflow
 */
export interface DeleteWorkflowResponse {
    success: boolean;
}
