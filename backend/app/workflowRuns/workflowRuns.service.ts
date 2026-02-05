import { gql } from 'graphile-utils';
import {
    Either
    , error
    , success
} from '../../types';
import { ResourceError } from '../../errors';
import { postGraphileRequest } from '../../lib/postGraphile';
import { WorkflowRunNotFound } from './workflowRuns.errors';
import type {
    WorkflowRunSnapshotResponse
    , WorkflowRunHistoryItem
    , WorkflowRunMessageResponse
} from './workflowRuns.types';
import {
    sortWorkflowDagSteps
    , WorkflowStep
} from '../../lib/workflowDags';

interface WorkflowRunSnapshotQueryResult {
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

interface WorkflowRunListQueryResult {
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

interface WorkflowRunStatusQueryResult {
    allWorkflowRuns?: {
        nodes: Array<{
            id: string;
        } | null>;
    } | null;
}

/**
 * get workflow run snapshot data from the database
 *
 * @param workflowRunId - workflow run id
 * @returns Either<ResourceError, WorkflowRunSnapshotQueryResult>
 */
export const getWorkflowRunSnapshotData = async (
    workflowRunId: string
): Promise<Either<ResourceError, WorkflowRunSnapshotQueryResult>> => {

    // create graphql query
    const GET_WORKFLOW_RUN_SNAPSHOT = gql`
        query getWorkflowRunSnapshot($workflowRunId: UUID!) {
            workflowRunById(id: $workflowRunId) {
                id
                chatId
                status
                startedAt
                completedAt
                workflowVersionByWorkflowVersionId {
                    id
                    dag
                }
                stepRunsByWorkflowRunId(orderBy: STARTED_AT_ASC) {
                    nodes {
                        id
                        stepId
                        status
                        output
                        logs
                        toolCalls
                        error
                        startedAt
                        completedAt
                    }
                }
                messagesByWorkflowRunId(orderBy: CREATED_AT_ASC) {
                    nodes {
                        id
                        role
                        content
                        createdAt
                    }
                }
            }
        }
    `;

    // execute graphql query
    const result = await postGraphileRequest<WorkflowRunSnapshotQueryResult, { workflowRunId: string }>( {
        query: GET_WORKFLOW_RUN_SNAPSHOT
        , variables: { workflowRunId }
    } );

    // check for error
    if ( result.isError() ) {
        return error( result.value );
    }

    // check for missing workflow run
    if ( !result.value.workflowRunById ) {
        return error( new WorkflowRunNotFound() );
    }

    // return success
    return success( result.value );

};

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

/**
 * normalize snapshot query result into a structured snapshot source
 *
 * @param result - raw snapshot query result
 * @returns WorkflowRunSnapshotSource
 */
export const normalizeWorkflowRunSnapshotSource = (
    result: WorkflowRunSnapshotQueryResult
): WorkflowRunSnapshotSource => {

    // extract the workflow run record
    const workflowRunRecord = result.workflowRunById as NonNullable<WorkflowRunSnapshotQueryResult['workflowRunById']>;

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
 * build a workflow run snapshot response
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
        ? ( source.dag as { steps: Array<{ id: string; name?: string; instruction?: string; dependsOn?: string[] }> } ).steps
        : [];

    const normalizedDagSteps: WorkflowStep[] = dagSteps.map( step => ( {
        id: step.id
        , name: step.name ?? step.id
        , instruction: step.instruction ?? ''
        , dependsOn: step.dependsOn ?? []
    } ) );

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

/**
 * get workflow runs for a chat with step details
 *
 * @param chatId - chat id
 * @returns Either<ResourceError, WorkflowRunHistoryItem[]>
 */
export const getWorkflowRunsByChatId = async (
    chatId: string
): Promise<Either<ResourceError, WorkflowRunHistoryItem[]>> => {

    // create graphql query
    const GET_WORKFLOW_RUNS_BY_CHAT_ID = gql`
        query getWorkflowRunsByChatId($chatId: UUID!) {
            chatById(id: $chatId) {
                id
                workflowRunsByChatId(orderBy: STARTED_AT_ASC) {
                    nodes {
                        id
                        status
                        startedAt
                        completedAt
                        triggerMessageId
                        workflowVersionByWorkflowVersionId {
                            id
                            dag
                        }
                        stepRunsByWorkflowRunId(orderBy: STARTED_AT_ASC) {
                            nodes {
                                id
                                stepId
                                status
                                output
                                logs
                                toolCalls
                                error
                                startedAt
                                completedAt
                            }
                        }
                    }
                }
            }
        }
    `;

    // execute graphql query
    const result = await postGraphileRequest<WorkflowRunListQueryResult, { chatId: string }>( {
        query: GET_WORKFLOW_RUNS_BY_CHAT_ID
        , variables: { chatId }
    } );

    // check for error
    if ( result.isError() ) {
        return error( result.value );
    }

    const chat = result.value.chatById;

    if ( !chat ) {
        return success( [] );
    }

    const runNodes = chat.workflowRunsByChatId?.nodes ?? [];

    const workflowRuns: WorkflowRunHistoryItem[] = runNodes
        .filter( ( run ): run is NonNullable<typeof run> => run !== null )
        .map( run => {
            const stepRuns = ( run.stepRunsByWorkflowRunId?.nodes ?? [] )
                .filter( ( stepRun ): stepRun is NonNullable<typeof stepRun> => stepRun !== null );

            const source: WorkflowRunSnapshotSource = {
                workflowRun: run
                , dag: run.workflowVersionByWorkflowVersionId?.dag ?? { steps: [] }
                , stepRuns
                , messages: []
            };

            const snapshot = buildWorkflowRunSnapshot( source );

            return {
                id: run.id
                , status: snapshot.workflowRun.status
                , startedAt: snapshot.workflowRun.startedAt
                , completedAt: snapshot.workflowRun.completedAt ?? null
                , triggerMessageId: run.triggerMessageId
                , steps: snapshot.steps
            };
        } );

    return success( workflowRuns );

};

/**
 * check if a chat currently has a running workflow run
 *
 * @param chatId - chat id
 * @returns Either<ResourceError, { id } | null>
 */
export const getRunningWorkflowRunByChatId = async (
    chatId: string
): Promise<Either<ResourceError, { id: string } | null>> => {

    // create graphql query
    const GET_RUNNING_WORKFLOW_RUN = gql`
        query getRunningWorkflowRun($chatId: UUID!) {
            allWorkflowRuns(condition: { chatId: $chatId, status: RUNNING }) {
                nodes {
                    id
                }
            }
        }
    `;

    // execute graphql query
    const result = await postGraphileRequest<WorkflowRunStatusQueryResult, { chatId: string }>( {
        query: GET_RUNNING_WORKFLOW_RUN
        , variables: { chatId }
    } );

    // check for error
    if ( result.isError() ) {
        return error( result.value );
    }

    const nodes = result.value.allWorkflowRuns?.nodes ?? [];
    const runningRun = nodes.find( ( run ): run is NonNullable<typeof run> => run !== null );

    if ( !runningRun ) {
        return success( null );
    }

    return success( { id: runningRun.id } );

};
