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
    WorkflowRunHistoryItem
    , WorkflowRunSnapshotQueryResult
    , WorkflowRunListQueryResult
    , WorkflowRunStatusQueryResult
    , WorkflowRunSnapshotSource
} from './workflowRuns.types';
import {
    buildWorkflowRunSnapshot
    , normalizeWorkflowRunSnapshotSource
} from './workflowRuns.helper';

// Re-export helpers for controller use
export { buildWorkflowRunSnapshot, normalizeWorkflowRunSnapshotSource };

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
