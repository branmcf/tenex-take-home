/* eslint-disable */
import * as Types from '../../lib/postGraphile/postGraphile.generatedTypes';

export type GetWorkflowChatMessagesQueryVariables = Types.Exact<{
  workflowId: Types.Scalars['UUID']['input'];
}>;


export type GetWorkflowChatMessagesQuery = { __typename: 'Query', workflowById?: { __typename: 'Workflow', id: any, workflowChatMessagesByWorkflowId: { __typename: 'WorkflowChatMessagesConnection', nodes: Array<{ __typename: 'WorkflowChatMessage', id: any, role: Types.MessageRole, content: string, createdAt: any } | null> } } | null };

export type CreateWorkflowChatMessageMutationVariables = Types.Exact<{
  workflowId: Types.Scalars['UUID']['input'];
  role: Types.MessageRole;
  content: Types.Scalars['String']['input'];
  modelId?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type CreateWorkflowChatMessageMutation = { __typename: 'Mutation', createWorkflowChatMessage?: { __typename: 'CreateWorkflowChatMessagePayload', workflowChatMessage?: { __typename: 'WorkflowChatMessage', id: any, role: Types.MessageRole, content: string, createdAt: any } | null } | null };
