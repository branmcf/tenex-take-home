"use client";

import { ArrowsClockwise } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { useUsage } from "@/hooks";
import { cn } from "@/lib/utils";

function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function UsageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Period skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="h-8 w-20 animate-pulse rounded bg-muted" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border bg-card p-4">
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-7 w-24 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-3 w-32 animate-pulse rounded bg-muted" />
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-7 w-16 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-3 w-24 animate-pulse rounded bg-muted" />
        </div>
      </div>

      {/* Breakdown skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-28 animate-pulse rounded bg-muted" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <div className="space-y-1.5">
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            </div>
            <div className="space-y-1.5 text-right">
              <div className="h-4 w-12 animate-pulse rounded bg-muted" />
              <div className="h-3 w-8 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UsageTab() {
  const { usage, isLoading, error, refetch } = useUsage();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-muted-foreground">Failed to load usage data</p>
        <Button variant="outline" size="sm" onClick={refetch} className="mt-4">
          Try again
        </Button>
      </div>
    );
  }

  if (isLoading && !usage) {
    return <UsageSkeleton />;
  }

  if (!usage) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Period Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {formatDate(usage.periodStart)} - {formatDate(usage.periodEnd)}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={refetch}
          disabled={isLoading}
          className="h-8 text-xs"
        >
          <ArrowsClockwise className={cn("size-3.5", isLoading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total tokens</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">
            {formatNumber(usage.totalTokens)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatNumber(usage.inputTokens)} in / {formatNumber(usage.outputTokens)} out
          </p>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Estimated cost</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">
            {formatCurrency(usage.estimatedCost)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">This period</p>
        </div>
      </div>

      {/* Model Breakdown */}
      <div>
        <h3 className="mb-3 text-sm font-medium">By model</h3>
        <div className="space-y-1">
          {usage.byModel.map((modelUsage) => (
            <div
              key={modelUsage.model}
              className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-muted/50"
            >
              <div>
                <p className="text-sm font-medium">{modelUsage.model}</p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {formatNumber(modelUsage.totalTokens)} tokens
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium tabular-nums">
                  {formatCurrency(modelUsage.estimatedCost)}
                </p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {((modelUsage.totalTokens / usage.totalTokens) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
