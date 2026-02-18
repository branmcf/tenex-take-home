import {
    sortWorkflowDagSteps
    , WorkflowStep
} from '../../utils/workflowDags';
import type {
    WorkflowRunSnapshotQueryResult
    , WorkflowRunSnapshotSource
    , WorkflowRunSnapshotResponse
    , WorkflowRunMessageResponse
} from './workflowRuns.types';

/**
 * Check if a workflow run status is terminal (PASSED, FAILED, or CANCELLED)
 *
 * @param status - workflow run status string
 * @returns true if the status is terminal
 */
export const isTerminalStatus = ( status: string ): boolean => {
    return status === 'PASSED' || status === 'FAILED' || status === 'CANCELLED';
};

/**
 * Normalize snapshot query result into a structured snapshot source
 *
 * @param result - raw snapshot query result
 * @returns WorkflowRunSnapshotSource
 */
export const normalizeWorkflowRunSnapshotSource = (
    result: WorkflowRunSnapshotQueryResult
): WorkflowRunSnapshotSource => {

    // extract the workflow run record
    const workflowRunRecord = result.workflowRunById as NonNullable<
        WorkflowRunSnapshotQueryResult['workflowRunById']
    >;

    const workflowRun = {
        id: workflowRunRecord.id
        , chatId: workflowRunRecord.chatId
        , status: workflowRunRecord.status
        , startedAt: workflowRunRecord.startedAt
        , completedAt: workflowRunRecord.completedAt ?? null
    };

    // extract dag
    const dag = workflowRunRecord.workflowVersionByWorkflowVersionId?.dag ?? { steps: [] };

    // normalize step runs
    const stepRuns = ( workflowRunRecord.stepRunsByWorkflowRunId?.nodes ?? [] )
        .filter( ( stepRun ): stepRun is NonNullable<typeof stepRun> => stepRun !== null );

    // normalize messages
    const messages = ( workflowRunRecord.messagesByWorkflowRunId?.nodes ?? [] )
        .filter( ( message ): message is NonNullable<typeof message> => message !== null );

    return {
        workflowRun
        , dag
        , stepRuns
        , messages
    };

};

/**
 * Build a workflow run snapshot response
 *
 * @param source - normalized snapshot source
 * @returns WorkflowRunSnapshotResponse
 */
export const buildWorkflowRunSnapshot = (
    source: WorkflowRunSnapshotSource
): WorkflowRunSnapshotResponse => {

    // build a lookup for step runs by step id
    const stepRunMap = new Map(
        source.stepRuns.map( stepRun => [ stepRun.stepId, stepRun ] )
    );

    // normalize dag steps
    const dagSteps = Array.isArray( ( source.dag as { steps?: unknown[] } )?.steps )
        ? ( source.dag as {
            steps: Array<{
                id: string;
                name?: string;
                instruction?: string;
                dependsOn?: string[];
            }>;
        } ).steps
        : [];

    const normalizedDagSteps: WorkflowStep[] = dagSteps.map( step => ( {
        id: step.id
        , name: step.name ?? step.id
        , instruction: step.instruction ?? ''
        , dependsOn: step.dependsOn ?? []
    } ) );

    // keep response steps in dependency order for stable rendering
    const orderedDagSteps = sortWorkflowDagSteps( normalizedDagSteps );

    // map dag steps to snapshot steps
    const steps = orderedDagSteps.map( step => {
        const stepRun = stepRunMap.get( step.id );
        const status = stepRun?.status ?? 'QUEUED';

        return {
            id: step.id
            , stepId: step.id
            , name: step.name ?? step.id
            , status
            , output: stepRun?.output ?? null
            , error: stepRun?.error ?? null
            , logs: stepRun?.logs ?? null
            , toolCalls: stepRun?.toolCalls ?? null
            , startedAt: stepRun?.startedAt ?? null
            , completedAt: stepRun?.completedAt ?? null
        };
    } );

    // if dag steps are missing, fall back to step run order
    const fallbackSteps = steps.length === 0
        ? source.stepRuns.map( stepRun => ( {
            id: stepRun.stepId
            , stepId: stepRun.stepId
            , name: stepRun.stepId
            , status: stepRun.status
            , output: stepRun.output ?? null
            , error: stepRun.error ?? null
            , logs: stepRun.logs ?? null
            , toolCalls: stepRun.toolCalls ?? null
            , startedAt: stepRun.startedAt ?? null
            , completedAt: stepRun.completedAt ?? null
        } ) )
        : steps;

    // find the most recent workflow run message (assistant/system)
    const lastMessage = source.messages.length > 0
        ? source.messages[ source.messages.length - 1 ]
        : null;

    const message: WorkflowRunMessageResponse | null = lastMessage
        ? {
            id: lastMessage.id
            , role: lastMessage.role === 'USER'
                ? 'user'
                : lastMessage.role === 'SYSTEM'
                    ? 'system'
                    : 'assistant'
            , content: lastMessage.content
            , createdAt: lastMessage.createdAt
        }
        : null;

    return {
        workflowRun: {
            id: source.workflowRun.id
            , status: source.workflowRun.status
            , startedAt: source.workflowRun.startedAt
            , completedAt: source.workflowRun.completedAt ?? null
        }
        , steps: fallbackSteps
        , message
    };

};
