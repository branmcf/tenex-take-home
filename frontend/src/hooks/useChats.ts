"use client";

import { useState, useEffect, useCallback } from "react";
import { getChats, deleteChat as apiDeleteChat } from "@/lib/api";

export interface SearchResultItemData {
    id: string;
    title: string | null;
    snippet?: string;
    updatedAt: Date;
}

interface UseChatsParams {
    userId: string;
    limit?: number;
    offset?: number;
    enabled?: boolean;
}

interface UseChatsReturn {
    chats: SearchResultItemData[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
    fetchMore: (newLimit: number) => Promise<void>;
    deleteChat: (chatId: string) => Promise<void>;
    hasMore: boolean;
}

/**
 * Hook to fetch and manage user chats
 * @param params - User ID and optional pagination parameters
 * @returns Chats data, loading state, error, and refetch function
 */
export function useChats(params: UseChatsParams): UseChatsReturn {
    const { userId, limit = 30, offset = 0, enabled = true } = params;
    const [chats, setChats] = useState<SearchResultItemData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [currentLimit, setCurrentLimit] = useState(limit);
    const [hasMore, setHasMore] = useState(true);

    const fetchChats = useCallback(async (fetchLimit?: number) => {
        if (!enabled) return;

        setIsLoading(true);
        setError(null);
        try {
            const requestedLimit = fetchLimit ?? currentLimit;
            const data = await getChats({
                userId,
                limit: requestedLimit,
                offset,
            });

            // Convert string dates to Date objects
            const chatsWithDates = data.map((chat) => ({
                ...chat,
                updatedAt: new Date(chat.updatedAt),
            }));

            setChats(chatsWithDates);

            // Check if there are more chats to fetch
            // If we received fewer chats than requested, we've reached the end
            setHasMore(data.length >= requestedLimit);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to fetch chats"));
        } finally {
            setIsLoading(false);
        }
    }, [userId, currentLimit, offset, enabled]);

    const fetchMore = useCallback(async (newLimit: number) => {
        if (!hasMore) return; // Don't fetch if no more data
        setCurrentLimit(newLimit);
        await fetchChats(newLimit);
    }, [fetchChats, hasMore]);

    const deleteChat = useCallback(async (chatId: string) => {
        try {
            await apiDeleteChat(chatId);
            // Remove from local state immediately for optimistic UI
            setChats((prev) => prev.filter((chat) => chat.id !== chatId));
            // Optionally refetch to ensure consistency
            await fetchChats();
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to delete chat"));
            // Refetch to restore state if delete failed
            await fetchChats();
        }
    }, [fetchChats]);

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    return {
        chats,
        isLoading,
        error,
        refetch: fetchChats,
        fetchMore,
        deleteChat,
        hasMore,
    };
}
