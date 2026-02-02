"use client";

import { useState, useEffect, useCallback } from "react";

export interface ModelUsage {
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

export interface UsageData {
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
  byModel: ModelUsage[];
  periodStart: Date;
  periodEnd: Date;
}

interface UseUsageReturn {
  usage: UsageData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Mock usage data - replace with actual API implementation
const mockUsage: UsageData = {
  totalTokens: 1_247_832,
  inputTokens: 892_456,
  outputTokens: 355_376,
  estimatedCost: 18.72,
  byModel: [
    {
      model: "GPT-4",
      inputTokens: 412_345,
      outputTokens: 165_432,
      totalTokens: 577_777,
      estimatedCost: 11.56,
    },
    {
      model: "GPT-4o",
      inputTokens: 280_111,
      outputTokens: 89_944,
      totalTokens: 370_055,
      estimatedCost: 4.63,
    },
    {
      model: "GPT-3.5 Turbo",
      inputTokens: 200_000,
      outputTokens: 100_000,
      totalTokens: 300_000,
      estimatedCost: 2.53,
    },
  ],
  periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  periodEnd: new Date(),
};

export function useUsage(): UseUsageReturn {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Mock API call - replace with actual fetch
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUsage(mockUsage);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch usage data"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  return {
    usage,
    isLoading,
    error,
    refetch: fetchUsage,
  };
}
