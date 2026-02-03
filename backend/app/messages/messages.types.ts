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
    };
}

// response type for creating a new message
export interface CreateMessageResponse {
    userMessage: MessageResponse;
    assistantMessage: MessageResponse | null;
    chatId: string;
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
