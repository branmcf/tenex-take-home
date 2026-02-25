import { Request } from 'express';

// source for assistant messages
export interface SourceResponse {
    url: string;
    title: string;
    description?: string;
}

// individual message in the response
export interface MessageResponse {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt: string;
    sources?: SourceResponse[];
}

// request type for creating a new message
export interface CreateMessageRequest extends Request {
    params: {
        chatId: string;
    };

    body: {
        content: string;
        modelId: string;
        userId: string;
        workflowId?: string | null;
    };
}

// response type for creating a new message
export interface CreateMessageResponse {
    userMessage: MessageResponse;
    assistantMessage: MessageResponse | null;
    chatId: string;
    workflowRunId?: string;
    error?: {
        message: string;
        code: string;
    };
}

// request type for getting messages by chat ID
export interface GetMessagesByChatIdRequest extends Request {
    params: {
        chatId: string;
    };
}

// response type for getting messages by chat ID
export interface GetMessagesByChatIdResponse {
    messages: MessageResponse[];
}

// result type for chat resolution helper
export interface ResolveChatResult {
    isNewChat: boolean;
}

// result type for starting a workflow asynchronously
export interface WorkflowStartResult {
    workflowRunId: string;
}

// result type for generating a chat response (regular flow)
export interface ChatResponseResult {
    assistantContent: string;
    sources: SourceResponse[];
}

// data from a persisted user message
export interface UserMessageData {
    id: string;
    createdAt: string;
}
