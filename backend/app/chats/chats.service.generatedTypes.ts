/* eslint-disable */
import * as Types from '../../lib/postGraphile/postGraphile.generatedTypes';

export type GetUserChatsQueryVariables = Types.Exact<{
  userId: Types.Scalars['String']['input'];
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type GetUserChatsQuery = { __typename: 'Query', userById?: { __typename: 'User', id: string, chatsByUserId: { __typename: 'ChatsConnection', nodes: Array<{ __typename: 'Chat', id: any, title?: string | null, updatedAt: any, deletedAt?: any | null, messagesByChatId: { __typename: 'MessagesConnection', nodes: Array<{ __typename: 'Message', id: any, content: string } | null> } } | null> } } | null };

export type DeleteChatMutationVariables = Types.Exact<{
  chatId: Types.Scalars['UUID']['input'];
}>;


export type DeleteChatMutation = { __typename: 'Mutation', updateChatById?: { __typename: 'UpdateChatPayload', chat?: { __typename: 'Chat', id: any, deletedAt?: any | null } | null } | null };

export type GetChatOwnershipQueryVariables = Types.Exact<{
  chatId: Types.Scalars['UUID']['input'];
}>;


export type GetChatOwnershipQuery = { __typename: 'Query', chatById?: { __typename: 'Chat', id: any, userId: string, deletedAt?: any | null } | null };
