export interface Source {
  url: string;
  title: string;
  description?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
  sources?: Source[];
}

export interface Model {
  id: string;
  name: string;
  provider: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string | null;
  version: number | null;
  updatedAt: string;
}

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

export interface ChatContainerProps {
  className?: string;
}
