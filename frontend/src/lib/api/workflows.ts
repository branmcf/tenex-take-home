import { apiClient } from "../api-client";

/**
 * Workflow as returned by the API (list view)
 * Contains all fields needed for both chat modal and workflows list view
 */
export interface Workflow {
    id: string;
    name: string;
    description: string | null;
    version: number | null;
    updatedAt: string;
}

/**
 * Tool in a workflow step
 */
export interface WorkflowTool {
    id: string;
    name: string;
    description?: string;
    version?: string;
}

/**
 * Step in a workflow
 */
export interface WorkflowStep {
    id: string;
    name: string;
    prompt: string;
    tools: WorkflowTool[];
    order: number;
}

/**
 * Full workflow detail with steps
 */
export interface WorkflowDetail {
    id: string;
    name: string;
    description: string | null;
    version: number | null;
    steps: WorkflowStep[];
    createdAt: string;
    updatedAt: string;
}

/**
 * Workflow chat message
 */
export interface WorkflowChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: string;
}

/**
 * Response type for GET /api/users/:userId/workflows
 */
interface GetWorkflowsResponse {
    workflows: Workflow[];
}

/**
 * Response type for GET /api/workflows/:workflowId
 */
interface GetWorkflowByIdResponse {
    workflow: WorkflowDetail;
}

/**
 * Response type for POST /api/workflows
 */
interface CreateWorkflowResponse {
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
 * Response type for PATCH /api/workflows/:workflowId
 */
interface UpdateWorkflowResponse {
    workflow: {
        id: string;
        name: string;
        description: string | null;
        updatedAt: string;
    };
}

/**
 * Response type for DELETE /api/workflows/:workflowId
 */
interface DeleteWorkflowResponse {
    success: boolean;
}

/**
 * Response type for GET /api/workflows/:workflowId/messages
 */
interface GetWorkflowChatMessagesResponse {
    messages: WorkflowChatMessage[];
    pendingProposal?: {
        proposalId: string;
        baseVersionId: string | null;
        toolCalls: unknown;
        previewSteps: Array<{
            id: string;
            name: string;
            instruction: string;
            tools?: Array<{ id: string; name?: string; version?: string }>;
            dependsOn?: string[];
        }>;
        status?: "pending" | "applied" | "rejected" | "expired";
        createdAt?: string;
        resolvedAt?: string | null;
    } | null;
    proposals?: Array<{
        proposalId: string;
        baseVersionId: string | null;
        toolCalls: unknown;
        previewSteps: Array<{
            id: string;
            name: string;
            instruction: string;
            tools?: Array<{ id: string; name?: string; version?: string }>;
            dependsOn?: string[];
        }>;
        status: "pending" | "applied" | "rejected" | "expired";
        createdAt: string;
        resolvedAt?: string | null;
    }>;
}

/**
 * Response type for POST /api/workflows/:workflowId/messages
 */
interface CreateWorkflowChatMessageResponse {
    userMessage: WorkflowChatMessage;
    assistantMessage: WorkflowChatMessage | null;
    workflowId: string;
    proposedChanges?: {
        proposalId: string;
        baseVersionId: string | null;
        toolCalls: unknown;
        previewSteps: Array<{
            id: string;
            name: string;
            instruction: string;
            tools?: Array<{ id: string; name?: string; version?: string }>;
            dependsOn?: string[];
        }>;
        status?: "pending" | "applied" | "rejected" | "expired";
        createdAt?: string;
        resolvedAt?: string | null;
    };
    error?: {
        message: string;
        code: string;
    };
}

interface ApplyWorkflowProposalResponse {
    success: boolean;
    workflow: {
        id: string;
        name: string;
        description: string | null;
        updatedAt: string;
    };
    workflowVersion: {
        id: string;
        versionNumber: number;
        steps: WorkflowStep[];
    };
}

interface RejectWorkflowProposalResponse {
    success: boolean;
}

/**
 * Fetches all workflows for a user from the API.
 * @param userId - The user ID to fetch workflows for
 * @returns Array of user's workflows
 */
export async function getWorkflows(userId: string): Promise<Workflow[]> {
    const response = await apiClient.get<GetWorkflowsResponse>(
        `/api/users/${userId}/workflows`
    );
    return response.data.workflows;
}

/**
 * Fetches a workflow by ID with full details including steps.
 * @param workflowId - The workflow ID to fetch
 * @returns The workflow detail
 */
export async function getWorkflowById(workflowId: string): Promise<WorkflowDetail> {
    const response = await apiClient.get<GetWorkflowByIdResponse>(
        `/api/workflows/${workflowId}`
    );
    return response.data.workflow;
}

/**
 * Creates a new workflow.
 * @param data - The workflow data
 * @returns The created workflow
 */
export async function createWorkflow(data: {
    userId: string;
    name: string;
    description?: string;
}): Promise<CreateWorkflowResponse["workflow"]> {
    const response = await apiClient.post<CreateWorkflowResponse>(
        `/api/workflows`,
        data
    );
    return response.data.workflow;
}

/**
 * Updates an existing workflow.
 * @param workflowId - The workflow ID to update
 * @param data - The update data
 * @returns The updated workflow
 */
export async function updateWorkflow(
    workflowId: string,
    data: {
        name?: string;
        description?: string;
    }
): Promise<UpdateWorkflowResponse["workflow"]> {
    const response = await apiClient.patch<UpdateWorkflowResponse>(
        `/api/workflows/${workflowId}`,
        data
    );
    return response.data.workflow;
}

/**
 * Deletes a workflow (soft delete).
 * @param workflowId - The workflow ID to delete
 * @returns Success status
 */
export async function deleteWorkflow(workflowId: string): Promise<boolean> {
    const response = await apiClient.delete<DeleteWorkflowResponse>(
        `/api/workflows/${workflowId}`
    );
    return response.data.success;
}

/**
 * Fetches all chat messages for a workflow.
 * @param workflowId - The workflow ID
 * @returns Array of workflow chat messages
 */
export async function getWorkflowChatMessages(
    workflowId: string
): Promise<GetWorkflowChatMessagesResponse> {
    const response = await apiClient.get<GetWorkflowChatMessagesResponse>(
        `/api/workflows/${workflowId}/messages`
    );
    return response.data;
}

/**
 * Sends a message in a workflow chat and gets an AI response.
 * @param workflowId - The workflow ID
 * @param data - The message data
 * @returns The user message and assistant response
 */
export async function sendWorkflowChatMessage(
    workflowId: string,
    data: {
        content: string;
        modelId: string;
    }
): Promise<CreateWorkflowChatMessageResponse> {
    const response = await apiClient.post<CreateWorkflowChatMessageResponse>(
        `/api/workflows/${workflowId}/messages`,
        data
    );
    return response.data;
}

/**
 * Applies a workflow proposal.
 * @param workflowId - The workflow ID
 * @param proposalId - The proposal ID
 * @returns Updated workflow version
 */
export async function applyWorkflowChatProposal(
    workflowId: string,
    proposalId: string
): Promise<ApplyWorkflowProposalResponse> {
    const response = await apiClient.post<ApplyWorkflowProposalResponse>(
        `/api/workflows/${workflowId}/messages/apply`,
        { proposalId }
    );
    return response.data;
}

/**
 * Rejects a workflow proposal.
 * @param workflowId - The workflow ID
 * @param proposalId - The proposal ID
 * @returns Success status
 */
export async function rejectWorkflowChatProposal(
    workflowId: string,
    proposalId: string
): Promise<RejectWorkflowProposalResponse> {
    const response = await apiClient.post<RejectWorkflowProposalResponse>(
        `/api/workflows/${workflowId}/messages/reject`,
        { proposalId }
    );
    return response.data;
}
