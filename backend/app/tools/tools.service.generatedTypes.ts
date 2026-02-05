/* eslint-disable */
import * as Types from '../../lib/postGraphile/postGraphile.generatedTypes';

export type GetToolsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetToolsQuery = { __typename: 'Query', allTools?: { __typename: 'ToolsConnection', nodes: Array<{ __typename: 'Tool', id: any, name: string, description?: string | null, schema?: any | null, source: string, externalId?: string | null, version?: string | null } | null> } | null };

export type GetToolByIdQueryVariables = Types.Exact<{
  toolId: Types.Scalars['UUID']['input'];
}>;


export type GetToolByIdQuery = { __typename: 'Query', toolById?: { __typename: 'Tool', id: any, name: string, description?: string | null, schema?: any | null, source: string, externalId?: string | null, version?: string | null } | null };

export type GetToolByExternalIdQueryVariables = Types.Exact<{
  externalId: Types.Scalars['String']['input'];
}>;


export type GetToolByExternalIdQuery = { __typename: 'Query', allTools?: { __typename: 'ToolsConnection', nodes: Array<{ __typename: 'Tool', id: any, name: string, description?: string | null, schema?: any | null, source: string, externalId?: string | null, version?: string | null } | null> } | null };

export type CreateToolMutationVariables = Types.Exact<{
  tool: Types.ToolInput;
}>;


export type CreateToolMutation = { __typename: 'Mutation', createTool?: { __typename: 'CreateToolPayload', tool?: { __typename: 'Tool', id: any, name: string, description?: string | null, schema?: any | null, source: string, externalId?: string | null, version?: string | null } | null } | null };

export type UpdateToolByIdMutationVariables = Types.Exact<{
  toolId: Types.Scalars['UUID']['input'];
  toolPatch: Types.ToolPatch;
}>;


export type UpdateToolByIdMutation = { __typename: 'Mutation', updateToolById?: { __typename: 'UpdateToolPayload', tool?: { __typename: 'Tool', id: any, name: string, description?: string | null, schema?: any | null, source: string, externalId?: string | null, version?: string | null } | null } | null };
