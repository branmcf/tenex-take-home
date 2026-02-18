/* eslint-disable */
import * as Types from '../../../lib/postGraphile/postGraphile.generatedTypes';

export type GetUserModelPreferenceQueryVariables = Types.Exact<{
  userId: Types.Scalars['String']['input'];
}>;


export type GetUserModelPreferenceQuery = { __typename: 'Query', allUserModelPreferences?: { __typename: 'UserModelPreferencesConnection', nodes: Array<{ __typename: 'UserModelPreference', id: any, userId: string, modelId: string, createdAt: any, updatedAt: any } | null> } | null };

export type CreateUserModelPreferenceMutationVariables = Types.Exact<{
  userId: Types.Scalars['String']['input'];
  modelId: Types.Scalars['String']['input'];
}>;


export type CreateUserModelPreferenceMutation = { __typename: 'Mutation', createUserModelPreference?: { __typename: 'CreateUserModelPreferencePayload', userModelPreference?: { __typename: 'UserModelPreference', id: any, userId: string, modelId: string, createdAt: any, updatedAt: any } | null } | null };

export type UpdateUserModelPreferenceMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
  modelId: Types.Scalars['String']['input'];
}>;


export type UpdateUserModelPreferenceMutation = { __typename: 'Mutation', updateUserModelPreferenceById?: { __typename: 'UpdateUserModelPreferencePayload', userModelPreference?: { __typename: 'UserModelPreference', id: any, userId: string, modelId: string, createdAt: any, updatedAt: any } | null } | null };
