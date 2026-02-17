/* eslint-disable */
import * as Types from '../postGraphile/postGraphile.generatedTypes';

export type CreateWorkflowProposalMutationVariables = Types.Exact<{
  workflowId: Types.Scalars['UUID']['input'];
  baseVersionId?: Types.InputMaybe<Types.Scalars['UUID']['input']>;
  userMessage: Types.Scalars['String']['input'];
  modelId?: Types.InputMaybe<Types.Scalars['String']['input']>;
  toolCalls: Types.Scalars['JSON']['input'];
  proposedDag: Types.Scalars['JSON']['input'];
  expiresAt: Types.Scalars['Datetime']['input'];
}>;


export type CreateWorkflowProposalMutation = { __typename: 'Mutation', createWorkflowProposal?: { __typename: 'CreateWorkflowProposalPayload', workflowProposal?: { __typename: 'WorkflowProposal', id: any, workflowId: any, baseVersionId?: any | null, userMessage: string, modelId?: string | null, toolCalls: any, proposedDag: any, createdAt: any, expiresAt: any } | null } | null };

export type GetWorkflowProposalByIdQueryVariables = Types.Exact<{
  proposalId: Types.Scalars['UUID']['input'];
}>;


export type GetWorkflowProposalByIdQuery = { __typename: 'Query', workflowProposalById?: { __typename: 'WorkflowProposal', id: any, workflowId: any, baseVersionId?: any | null, userMessage: string, modelId?: string | null, toolCalls: any, proposedDag: any, createdAt: any, expiresAt: any } | null };

export type GetWorkflowProposalsByWorkflowIdQueryVariables = Types.Exact<{
  workflowId: Types.Scalars['UUID']['input'];
  limit: Types.Scalars['Int']['input'];
}>;


export type GetWorkflowProposalsByWorkflowIdQuery = { __typename: 'Query', workflowById?: { __typename: 'Workflow', id: any, workflowProposalsByWorkflowId: { __typename: 'WorkflowProposalsConnection', nodes: Array<{ __typename: 'WorkflowProposal', id: any, workflowId: any, baseVersionId?: any | null, userMessage: string, modelId?: string | null, toolCalls: any, proposedDag: any, createdAt: any, expiresAt: any, status: string, resolvedAt?: any | null } | null> } } | null };

export type UpdateWorkflowProposalStatusMutationVariables = Types.Exact<{
  proposalId: Types.Scalars['UUID']['input'];
  status: Types.Scalars['String']['input'];
  resolvedAt?: Types.InputMaybe<Types.Scalars['Datetime']['input']>;
}>;


export type UpdateWorkflowProposalStatusMutation = { __typename: 'Mutation', updateWorkflowProposalById?: { __typename: 'UpdateWorkflowProposalPayload', workflowProposal?: { __typename: 'WorkflowProposal', id: any } | null } | null };

export type DeleteWorkflowProposalByIdMutationVariables = Types.Exact<{
  proposalId: Types.Scalars['UUID']['input'];
}>;


export type DeleteWorkflowProposalByIdMutation = { __typename: 'Mutation', deleteWorkflowProposalById?: { __typename: 'DeleteWorkflowProposalPayload', workflowProposal?: { __typename: 'WorkflowProposal', id: any } | null } | null };
