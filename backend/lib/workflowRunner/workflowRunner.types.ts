// result from workflow run execution
export interface WorkflowRunResult {
    workflowRunId: string;
    content: string;
}

// callbacks for workflow run events
export interface WorkflowRunCallbacks {
    onRunCreated?: ( workflowRunId: string ) => void;
}

// log entry for a single tool execution
export interface WorkflowToolLogEntry {
    toolName: string;
    input: Record<string, unknown>;
    output?: unknown;
    error?: string;
    errorCode?: string;
    errorDetails?: unknown;
    status: 'RUNNING' | 'PASSED' | 'FAILED';
    startedAt: string;
    completedAt?: string;
    toolCallId?: string | null;
}

// summary of tool execution results
export interface ToolExecutionSummary {
    total: number;
    passed: number;
    failed: number;
    failedTools: string[];
}
