/* eslint-disable */
import * as Types from '../../lib/postGraphile/postGraphile.generatedTypes';

export type GetActiveModelsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetActiveModelsQuery = { __typename: 'Query', allModels?: { __typename: 'ModelsConnection', nodes: Array<{ __typename: 'Model', id: string, name: string, provider: string } | null> } | null };
