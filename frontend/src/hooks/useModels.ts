"use client";

import { useState, useEffect, useCallback } from "react";
import type { Model } from "@/components/chat/types";
import { getModels } from "@/lib/api";

interface UseModelsReturn {
    models: Model[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export function useModels(): UseModelsReturn {
    const [models, setModels] = useState<Model[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchModels = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getModels();
            setModels(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to fetch models"));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchModels();
    }, [fetchModels]);

    return {
        models,
        isLoading,
        error,
        refetch: fetchModels,
    };
}
