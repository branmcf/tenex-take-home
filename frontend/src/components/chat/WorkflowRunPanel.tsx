"use client";

import * as React from "react";
import { CheckCircle, XCircle, Clock, SpinnerGap, CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { WorkflowRunState, WorkflowStepStatus } from "./types";

interface WorkflowRunPanelProps {
  run: WorkflowRunState;
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "RUNNING":
      return "Running";
    case "PASSED":
      return "Passed";
    case "FAILED":
      return "Failed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "RUNNING":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "PASSED":
      return "text-emerald-600 bg-emerald-50 border-emerald-200";
    case "FAILED":
      return "text-rose-600 bg-rose-50 border-rose-200";
    case "CANCELLED":
      return "text-slate-500 bg-slate-50 border-slate-200";
    default:
      return "text-slate-600 bg-slate-50 border-slate-200";
  }
};

const StepStatusIcon = ({ status }: { status: WorkflowStepStatus }) => {
  if (status === "PASSED") {
    return <CheckCircle className="h-4 w-4 text-emerald-500" weight="fill" />;
  }

  if (status === "FAILED") {
    return <XCircle className="h-4 w-4 text-rose-500" weight="fill" />;
  }

  if (status === "RUNNING") {
    return <SpinnerGap className="h-4 w-4 text-blue-500 animate-spin" weight="bold" />;
  }

  return <Clock className="h-4 w-4 text-slate-400" weight="duotone" />;
};

const StepLogBlock = ({ text }: { text: string }) => {
  const logRef = React.useRef<HTMLPreElement | null>(null);
  const [stickToBottom, setStickToBottom] = React.useState(true);

  React.useEffect(() => {
    const element = logRef.current;
    if (!element) {
      return;
    }

    if (stickToBottom) {
      element.scrollTop = element.scrollHeight;
    }
  }, [text, stickToBottom]);

  const handleScroll = () => {
    const element = logRef.current;
    if (!element) {
      return;
    }

    const distanceFromBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight;
    const isAtBottom = distanceFromBottom < 24;

    setStickToBottom(isAtBottom);
  };

  return (
    <pre
      ref={logRef}
      onScroll={handleScroll}
      className="h-56 overflow-y-auto whitespace-pre-wrap px-3 py-3 text-xs font-mono leading-relaxed"
    >
      {text}
    </pre>
  );
};

const isEmptyLogValue = (value: unknown) => {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim().length === 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === "object") {
    return Object.keys(value as Record<string, unknown>).length === 0;
  }

  return false;
};

const formatLogSection = (
  label: string,
  value: unknown,
  emptyFallback?: string
) => {
  if (isEmptyLogValue(value)) {
    if (!emptyFallback) {
      return null;
    }

    return `# ${label}\n${emptyFallback}`;
  }

  const content =
    typeof value === "string" ? value : JSON.stringify(value, null, 2);

  if (!content || content.trim().length === 0) {
    if (!emptyFallback) {
      return null;
    }

    return `# ${label}\n${emptyFallback}`;
  }

  return `# ${label}\n${content}`;
};

const getLogStatusLabel = (status: WorkflowStepStatus) => {
  switch (status) {
    case "RUNNING":
      return "Live";
    case "PASSED":
      return "Completed";
    case "FAILED":
      return "Failed";
    case "CANCELLED":
      return "Cancelled";
    case "QUEUED":
      return "Pending";
    default:
      return "Idle";
  }
};

const getLogStatusTone = (status: WorkflowStepStatus) => {
  switch (status) {
    case "RUNNING":
      return "text-emerald-300";
    case "FAILED":
      return "text-rose-300";
    case "CANCELLED":
      return "text-slate-400";
    default:
      return "text-slate-300";
  }
};

export function WorkflowRunPanel({ run }: WorkflowRunPanelProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Workflow Run</p>
          <p className="text-xs text-muted-foreground">
            {run.steps.length} step{run.steps.length === 1 ? "" : "s"}
          </p>
        </div>
        <span
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
            getStatusColor(run.status)
          )}
        >
          {getStatusLabel(run.status)}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {run.steps.length === 0 && (
          <div className="text-xs text-muted-foreground">Waiting for steps...</div>
        )}
        {run.steps.map((step) => {
          const toolCallsEmpty = isEmptyLogValue(step.toolCalls);
          const logsFallback = toolCallsEmpty
            ? "No logs captured for this step."
            : "No tool results captured yet.";

          const logText =
            [
              formatLogSection("STATUS", step.status),
              formatLogSection("OUTPUT", step.output),
              formatLogSection("ERROR", step.error),
              formatLogSection("LOGS", step.logs, logsFallback),
              formatLogSection("TOOL CALLS", step.toolCalls),
            ]
              .filter(Boolean)
              .join("\n\n") || "Waiting for output...";

          return (
            <details
              key={step.id}
              className="group rounded-lg border border-border/60 bg-background/60"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                  <StepStatusIcon status={step.status} />
                  <span className="text-sm text-foreground">{step.name}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  <span>{step.status}</span>
                  <CaretDown
                    className="h-3.5 w-3.5 transition-transform duration-200 group-open:rotate-180"
                    weight="bold"
                  />
                </div>
              </summary>
              <div className="border-t border-border/60 px-3 py-3">
                <div className="rounded-md border border-border/60 bg-slate-900/90 text-slate-100">
                  <div className="flex items-center justify-between border-b border-slate-700/60 px-3 py-2 text-[11px] uppercase tracking-wide text-slate-300">
                    <span>Step Logs</span>
                    <span
                      className={cn("font-mono", getLogStatusTone(step.status))}
                    >
                      {getLogStatusLabel(step.status)}
                    </span>
                  </div>
                  <StepLogBlock text={logText} />
                </div>
              </div>
            </details>
          );
        })}
      </div>

      {run.status === "FAILED" && (
        <div className="mt-3 text-xs text-rose-500">
          Workflow failed. Check step logs for details.
        </div>
      )}
    </div>
  );
}
