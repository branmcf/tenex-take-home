import { apiClient } from "../api-client";

export interface ChatItem {
    id: string;
    title: string | null;
    snippet?: string;
    updatedAt: string;
}

interface GetChatsResponse {
    chats: ChatItem[];
}

interface GetChatsParams {
    userId: string;
    limit?: number;
    offset?: number;
}

/**
 * Fetches chats for a user from the API.
 * @param params - User ID and optional pagination parameters
 * @returns Array of user chats
 */
export async function getChats(params: GetChatsParams): Promise<ChatItem[]> {
    const { userId, limit, offset } = params;

    const queryParams = new URLSearchParams();
    if (limit !== undefined) queryParams.append("limit", limit.toString());
    if (offset !== undefined) queryParams.append("offset", offset.toString());

    const queryString = queryParams.toString();
    const url = `/api/users/${userId}/chats${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get<GetChatsResponse>(url);

    // Convert string dates to Date objects for frontend compatibility
    return response.data.chats.map(chat => ({
        ...chat,
        updatedAt: chat.updatedAt, // Keep as string, will convert in hook if needed
    }));
}

interface DeleteChatResponse {
    success: boolean;
}

/**
 * Deletes a chat (soft delete).
 * @param chatId - The chat ID to delete
 * @returns Success status
 */
export async function deleteChat(chatId: string): Promise<boolean> {
    const response = await apiClient.delete<DeleteChatResponse>(`/api/chats/${chatId}`);
    return response.data.success;
}

// Message API types
export interface Source {
    url: string;
    title: string;
    description?: string;
}

export interface MessageResponse {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    createdAt: string;
    sources?: Source[];
}

interface CreateMessageRequest {
    content: string;
    modelId: string;
    userId: string;
}

interface CreateMessageResponse {
    userMessage: MessageResponse;
    assistantMessage: MessageResponse | null;
    chatId: string;
    error?: {
        message: string;
        code: string;
    };
}

interface GetMessagesResponse {
    messages: MessageResponse[];
}

/**
 * Creates a new message in a chat and gets the assistant's response.
 * @param chatId - The chat ID (or "new" for a new chat)
 * @param data - Message content, model ID, and user ID
 * @returns User message, assistant message, and chat ID
 */
export async function createMessage(
    chatId: string,
    data: CreateMessageRequest
): Promise<CreateMessageResponse> {
    const response = await apiClient.post<CreateMessageResponse>(
        `/api/chats/${chatId}/messages`,
        data
    );
    return response.data;
}

/**
 * Fetches all messages for a chat.
 * @param chatId - The chat ID
 * @returns Array of messages
 */
export async function getMessages(chatId: string): Promise<MessageResponse[]> {
    const response = await apiClient.get<GetMessagesResponse>(
        `/api/chats/${chatId}/messages`
    );
    return response.data.messages;
}
