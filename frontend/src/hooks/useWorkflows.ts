"use client";

import { useState, useEffect, useCallback } from "react";
import { getWorkflows, type Workflow } from "@/lib/api";

interface UseWorkflowsOptions {
    userId: string;
    enabled?: boolean;
}

interface UseWorkflowsReturn {
    workflows: Workflow[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export function useWorkflows({ userId, enabled = true }: UseWorkflowsOptions): UseWorkflowsReturn {
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchWorkflows = useCallback(async () => {
        if (!userId || !enabled) {
            setWorkflows([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const data = await getWorkflows(userId);
            setWorkflows(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to fetch workflows"));
        } finally {
            setIsLoading(false);
        }
    }, [userId, enabled]);

    useEffect(() => {
        fetchWorkflows();
    }, [fetchWorkflows]);

    return {
        workflows,
        isLoading,
        error,
        refetch: fetchWorkflows,
    };
}
