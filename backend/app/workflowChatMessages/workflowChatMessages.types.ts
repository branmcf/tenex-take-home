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
    error?: {
        message: string;
        code: string;
    };
}
