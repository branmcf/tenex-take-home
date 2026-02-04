import { Request } from 'express';

/**
 * message role type for workflow chat messages
 */
export type WorkflowChatMessageRole = 'user' | 'assistant';

/**
 * individual workflow chat message in response
 */
export interface WorkflowChatMessageResponse {
    id: string;
    role: WorkflowChatMessageRole;
    content: string;
    createdAt: string;
}

/**
 * proposed workflow changes from the LLM
 */
export interface WorkflowChatProposedChanges {
    proposalId: string;
    baseVersionId: string | null;
    toolCalls: unknown;
    previewSteps: Array<{
        id: string;
        name: string;
        instruction: string;
        tools?: Array<{
            id: string;
            name?: string;
            version?: string;
        }>;
        dependsOn?: string[];
    }>;
}

/**
 * request type for getting workflow chat messages
 */
export interface GetWorkflowChatMessagesRequest extends Request {
    params: {
        workflowId: string;
    };
}

/**
 * response type for getting workflow chat messages
 */
export interface GetWorkflowChatMessagesResponse {
    messages: WorkflowChatMessageResponse[];
}

/**
 * request type for creating a workflow chat message
 */
export interface CreateWorkflowChatMessageRequest extends Request {
    params: {
        workflowId: string;
    };
    body: {
        content: string;
        modelId: string;
    };
}

/**
 * response type for creating a workflow chat message
 */
export interface CreateWorkflowChatMessageResponse {
    userMessage: WorkflowChatMessageResponse;
    assistantMessage: WorkflowChatMessageResponse | null;
    workflowId: string;
    proposedChanges?: WorkflowChatProposedChanges;
    error?: {
        message: string;
        code: string;
    };
}

/**
 * request type for applying a workflow proposal
 */
export interface ApplyWorkflowProposalRequest extends Request {
    params: {
        workflowId: string;
    };
    body: {
        proposalId: string;
    };
}

/**
 * response type for applying a workflow proposal
 */
export interface ApplyWorkflowProposalResponse {
    success: boolean;
    workflowVersion: {
        id: string;
        versionNumber: number;
        steps: Array<{
            id: string;
            name: string;
            prompt: string;
            tools: Array<{
                id: string;
                name: string;
                version?: string;
            }>;
            order: number;
        }>;
    };
}
