import { Request } from 'express';

export interface WorkflowRunMessageResponse {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt: string;
}

export interface WorkflowRunStepResponse {
    id: string;
    stepId: string;
    name: string;
    status: 'QUEUED' | 'RUNNING' | 'PASSED' | 'FAILED' | 'CANCELLED';
    output?: string | null;
    error?: string | null;
    logs?: unknown | null;
    toolCalls?: unknown | null;
    startedAt?: string | null;
    completedAt?: string | null;
}

export interface WorkflowRunResponse {
    id: string;
    status: 'RUNNING' | 'PASSED' | 'FAILED' | 'CANCELLED';
    startedAt: string;
    completedAt?: string | null;
}

export interface WorkflowRunSnapshotResponse {
    workflowRun: WorkflowRunResponse;
    steps: WorkflowRunStepResponse[];
    message?: WorkflowRunMessageResponse | null;
}

export interface StreamWorkflowRunRequest extends Request {
    params: {
        chatId: string;
        workflowRunId: string;
    };
}

export interface GetWorkflowRunsRequest extends Request {
    params: {
        chatId: string;
    };
}

export interface WorkflowRunHistoryItem {
    id: string;
    status: 'RUNNING' | 'PASSED' | 'FAILED' | 'CANCELLED';
    startedAt: string;
    completedAt?: string | null;
    triggerMessageId: string;
    steps: WorkflowRunStepResponse[];
}

export interface GetWorkflowRunsResponse {
    workflowRuns: WorkflowRunHistoryItem[];
}
