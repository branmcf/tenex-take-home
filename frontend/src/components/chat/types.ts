// Re-exported from canonical locations — kept for backward compatibility
export type { Source, Message } from "@/types/chat";
export type { Model } from "@/types/model";
export type { Workflow } from "@/types/workflow";
export type {
  WorkflowRunStatus,
  WorkflowStepStatus,
  WorkflowRunStep,
  WorkflowRunState,
} from "@/types/workflowRun";

// Component-local type — stays here
export interface ChatContainerProps {
  className?: string;
}
