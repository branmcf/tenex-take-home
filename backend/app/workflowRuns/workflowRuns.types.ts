import { Request } from 'express';

/*
 * ============================================================================
 * Internal Query Result Types (for service layer)
 * ============================================================================
 */

/**
 * Query result type for workflow run snapshot data
 */
export interface WorkflowRunSnapshotQueryResult {
    workflowRunById?: {
        id: string;
        chatId: string;
        status: 'RUNNING' | 'PASSED' | 'FAILED' | 'CANCELLED';
        startedAt: string;
        completedAt?: string | null;
        workflowVersionByWorkflowVersionId?: {
            id: string;
            dag: unknown;
        } | null;
        stepRunsByWorkflowRunId: {
            nodes: Array<{
                id: string;
                stepId: string;
                status: 'QUEUED' | 'RUNNING' | 'PASSED' | 'FAILED' | 'CANCELLED';
                output?: string | null;
                logs?: unknown | null;
                toolCalls?: unknown | null;
                error?: string | null;
                startedAt?: string | null;
                completedAt?: string | null;
            } | null>;
        };
        messagesByWorkflowRunId: {
            nodes: Array<{
                id: string;
                role: 'USER' | 'ASSISTANT' | 'SYSTEM';
                content: string;
                createdAt: string;
            } | null>;
        };
    } | null;
}

/**
 * Query result type for workflow run list data
 */
export interface WorkflowRunListQueryResult {
    chatById?: {
        id: string;
        workflowRunsByChatId: {
            nodes: Array<{
                id: string;
                status: 'RUNNING' | 'PASSED' | 'FAILED' | 'CANCELLED';
                startedAt: string;
                completedAt?: string | null;
                triggerMessageId: string;
                workflowVersionByWorkflowVersionId?: {
                    id: string;
                    dag: unknown;
                } | null;
                stepRunsByWorkflowRunId: {
                    nodes: Array<{
                        id: string;
                        stepId: string;
                        status: 'QUEUED' | 'RUNNING' | 'PASSED' | 'FAILED' | 'CANCELLED';
                        output?: string | null;
                        logs?: unknown | null;
                        toolCalls?: unknown | null;
                        error?: string | null;
                        startedAt?: string | null;
                        completedAt?: string | null;
                    } | null>;
                };
            } | null>;
        };
    } | null;
}

/**
 * Query result type for workflow run status check
 */
export interface WorkflowRunStatusQueryResult {
    allWorkflowRuns?: {
        nodes: Array<{
            id: string;
        } | null>;
    } | null;
}

/**
 * Normalized snapshot source for building workflow run snapshots
 */
export interface WorkflowRunSnapshotSource {
    workflowRun: {
        id: string;
        chatId?: string;
        status: 'RUNNING' | 'PASSED' | 'FAILED' | 'CANCELLED';
        startedAt: string;
        completedAt?: string | null;
    };
    dag: unknown;
    stepRuns: Array<NonNullable<NonNullable<WorkflowRunSnapshotQueryResult['workflowRunById']>['stepRunsByWorkflowRunId']['nodes'][number]>>;
    messages: Array<NonNullable<NonNullable<WorkflowRunSnapshotQueryResult['workflowRunById']>['messagesByWorkflowRunId']['nodes'][number]>>;
}

/*
 * ============================================================================
 * API Response Types
 * ============================================================================
 */

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
