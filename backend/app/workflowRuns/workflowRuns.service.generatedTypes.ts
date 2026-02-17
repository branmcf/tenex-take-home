/* eslint-disable */
import * as Types from '../../lib/postGraphile/postGraphile.generatedTypes';

export type GetWorkflowRunSnapshotQueryVariables = Types.Exact<{
  workflowRunId: Types.Scalars['UUID']['input'];
}>;


export type GetWorkflowRunSnapshotQuery = { __typename: 'Query', workflowRunById?: { __typename: 'WorkflowRun', id: any, chatId: any, status: Types.WorkflowRunStatus, startedAt: any, completedAt?: any | null, workflowVersionByWorkflowVersionId?: { __typename: 'WorkflowVersion', id: any, dag: any } | null, stepRunsByWorkflowRunId: { __typename: 'StepRunsConnection', nodes: Array<{ __typename: 'StepRun', id: any, stepId: string, status: Types.StepRunStatus, output?: string | null, logs?: any | null, toolCalls?: any | null, error?: string | null, startedAt?: any | null, completedAt?: any | null } | null> }, messagesByWorkflowRunId: { __typename: 'MessagesConnection', nodes: Array<{ __typename: 'Message', id: any, role: Types.MessageRole, content: string, createdAt: any } | null> } } | null };

export type GetWorkflowRunsByChatIdQueryVariables = Types.Exact<{
  chatId: Types.Scalars['UUID']['input'];
}>;


export type GetWorkflowRunsByChatIdQuery = { __typename: 'Query', chatById?: { __typename: 'Chat', id: any, workflowRunsByChatId: { __typename: 'WorkflowRunsConnection', nodes: Array<{ __typename: 'WorkflowRun', id: any, status: Types.WorkflowRunStatus, startedAt: any, completedAt?: any | null, triggerMessageId: any, workflowVersionByWorkflowVersionId?: { __typename: 'WorkflowVersion', id: any, dag: any } | null, stepRunsByWorkflowRunId: { __typename: 'StepRunsConnection', nodes: Array<{ __typename: 'StepRun', id: any, stepId: string, status: Types.StepRunStatus, output?: string | null, logs?: any | null, toolCalls?: any | null, error?: string | null, startedAt?: any | null, completedAt?: any | null } | null> } } | null> } } | null };

export type GetRunningWorkflowRunQueryVariables = Types.Exact<{
  chatId: Types.Scalars['UUID']['input'];
}>;


export type GetRunningWorkflowRunQuery = { __typename: 'Query', allWorkflowRuns?: { __typename: 'WorkflowRunsConnection', nodes: Array<{ __typename: 'WorkflowRun', id: any } | null> } | null };
