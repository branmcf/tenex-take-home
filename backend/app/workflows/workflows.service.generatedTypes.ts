/* eslint-disable */
import * as Types from '../../lib/postGraphile/postGraphile.generatedTypes';

export type GetUserWorkflowsQueryVariables = Types.Exact<{
  userId: Types.Scalars['String']['input'];
}>;


export type GetUserWorkflowsQuery = { __typename: 'Query', userById?: { __typename: 'User', id: string, workflowsByUserId: { __typename: 'WorkflowsConnection', nodes: Array<{ __typename: 'Workflow', id: any, name: string, description?: string | null, updatedAt: any, workflowVersionsByWorkflowId: { __typename: 'WorkflowVersionsConnection', nodes: Array<{ __typename: 'WorkflowVersion', versionNumber: number } | null> } } | null> } } | null };

export type GetWorkflowByIdQueryVariables = Types.Exact<{
  workflowId: Types.Scalars['UUID']['input'];
}>;


export type GetWorkflowByIdQuery = { __typename: 'Query', workflowById?: { __typename: 'Workflow', id: any, name: string, description?: string | null, nameSource: string, descriptionSource: string, createdAt: any, updatedAt: any, deletedAt?: any | null, workflowVersionsByWorkflowId: { __typename: 'WorkflowVersionsConnection', nodes: Array<{ __typename: 'WorkflowVersion', id: any, versionNumber: number, dag: any } | null> } } | null };

export type GetWorkflowMetadataQueryVariables = Types.Exact<{
  workflowId: Types.Scalars['UUID']['input'];
}>;


export type GetWorkflowMetadataQuery = { __typename: 'Query', workflowById?: { __typename: 'Workflow', id: any, name: string, description?: string | null, nameSource: string, descriptionSource: string } | null };

export type UpdateWorkflowMetadataMutationVariables = Types.Exact<{
  workflowId: Types.Scalars['UUID']['input'];
  workflowPatch: Types.WorkflowPatch;
}>;


export type UpdateWorkflowMetadataMutation = { __typename: 'Mutation', updateWorkflowById?: { __typename: 'UpdateWorkflowPayload', workflow?: { __typename: 'Workflow', id: any } | null } | null };

export type CreateWorkflowMutationVariables = Types.Exact<{
  userId: Types.Scalars['String']['input'];
  name: Types.Scalars['String']['input'];
  description?: Types.InputMaybe<Types.Scalars['String']['input']>;
  nameSource?: Types.InputMaybe<Types.Scalars['String']['input']>;
  descriptionSource?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type CreateWorkflowMutation = { __typename: 'Mutation', createWorkflow?: { __typename: 'CreateWorkflowPayload', workflow?: { __typename: 'Workflow', id: any, name: string, description?: string | null, createdAt: any, updatedAt: any } | null } | null };

export type UpdateWorkflowMutationVariables = Types.Exact<{
  workflowId: Types.Scalars['UUID']['input'];
  workflowPatch: Types.WorkflowPatch;
}>;


export type UpdateWorkflowMutation = { __typename: 'Mutation', updateWorkflowById?: { __typename: 'UpdateWorkflowPayload', workflow?: { __typename: 'Workflow', id: any, name: string, description?: string | null, updatedAt: any } | null } | null };

export type DeleteWorkflowMutationVariables = Types.Exact<{
  workflowId: Types.Scalars['UUID']['input'];
}>;


export type DeleteWorkflowMutation = { __typename: 'Mutation', updateWorkflowById?: { __typename: 'UpdateWorkflowPayload', workflow?: { __typename: 'Workflow', id: any, deletedAt?: any | null } | null } | null };

export type GetLatestWorkflowVersionQueryVariables = Types.Exact<{
  workflowId: Types.Scalars['UUID']['input'];
}>;


export type GetLatestWorkflowVersionQuery = { __typename: 'Query', workflowById?: { __typename: 'Workflow', id: any, workflowVersionsByWorkflowId: { __typename: 'WorkflowVersionsConnection', nodes: Array<{ __typename: 'WorkflowVersion', id: any, versionNumber: number, dag: any } | null> } } | null };

export type CreateWorkflowVersionMutationVariables = Types.Exact<{
  workflowId: Types.Scalars['UUID']['input'];
  versionNumber: Types.Scalars['Int']['input'];
  dag: Types.Scalars['JSON']['input'];
}>;


export type CreateWorkflowVersionMutation = { __typename: 'Mutation', createWorkflowVersion?: { __typename: 'CreateWorkflowVersionPayload', workflowVersion?: { __typename: 'WorkflowVersion', id: any, versionNumber: number, dag: any, createdAt: any } | null } | null };

export type GetWorkflowOwnershipQueryVariables = Types.Exact<{
  workflowId: Types.Scalars['UUID']['input'];
}>;


export type GetWorkflowOwnershipQuery = { __typename: 'Query', workflowById?: { __typename: 'Workflow', id: any, userId: string, deletedAt?: any | null } | null };
