import { Request } from 'express';

/**
 * request type for getting user chats
 */
export interface GetUserChatsRequest extends Request {
    params: {
        userId: string;
    };
    query: {
        limit?: string;
        offset?: string;
    };
}

/**
 * individual chat item in response
 */
export interface ChatItem {
    id: string;
    title: string | null;
    snippet?: string;
    updatedAt: string;
}

/**
 * response type for getting user chats
 */
export interface GetUserChatsResponse {
    chats: ChatItem[];
}

/**
 * request type for deleting a chat
 */
export interface DeleteChatRequest extends Request {
    params: {
        chatId: string;
    };
}

/**
 * response type for deleting a chat
 */
export interface DeleteChatResponse {
    success: boolean;
}
