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

export type DeleteWorkflowProposalByIdMutationVariables = Types.Exact<{
  proposalId: Types.Scalars['UUID']['input'];
}>;


export type DeleteWorkflowProposalByIdMutation = { __typename: 'Mutation', deleteWorkflowProposalById?: { __typename: 'DeleteWorkflowProposalPayload', workflowProposal?: { __typename: 'WorkflowProposal', id: any } | null } | null };
