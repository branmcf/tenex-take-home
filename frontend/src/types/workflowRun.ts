import type { Message } from "./chat";

export type WorkflowRunStatus = "RUNNING" | "PASSED" | "FAILED" | "CANCELLED";

export type WorkflowStepStatus = "QUEUED" | "RUNNING" | "PASSED" | "FAILED" | "CANCELLED";

export interface WorkflowRunStep {
  id: string;
  name: string;
  status: WorkflowStepStatus;
  startedAt?: string | null;
  completedAt?: string | null;
  error?: string | null;
  output?: string | null;
  logs?: unknown | null;
  toolCalls?: unknown | null;
}

export interface WorkflowRunState {
  id: string;
  status: WorkflowRunStatus;
  startedAt?: string | null;
  completedAt?: string | null;
  steps: WorkflowRunStep[];
  message?: Message;
  anchorMessageId: string;
  chatId: string;
  isNewChat: boolean;
}
