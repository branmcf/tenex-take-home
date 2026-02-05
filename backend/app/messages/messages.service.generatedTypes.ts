/* eslint-disable */
import * as Types from '../../lib/postGraphile/postGraphile.generatedTypes';

export type GetChatByIdQueryVariables = Types.Exact<{
  chatId: Types.Scalars['UUID']['input'];
}>;


export type GetChatByIdQuery = { __typename: 'Query', chatById?: { __typename: 'Chat', id: any, userId: string, title?: string | null, createdAt: any, updatedAt: any } | null };

export type CreateChatMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
  userId: Types.Scalars['String']['input'];
  title?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type CreateChatMutation = { __typename: 'Mutation', createChat?: { __typename: 'CreateChatPayload', chat?: { __typename: 'Chat', id: any } | null } | null };

export type CreateMessageMutationVariables = Types.Exact<{
  chatId: Types.Scalars['UUID']['input'];
  role: Types.MessageRole;
  content: Types.Scalars['String']['input'];
  modelId?: Types.InputMaybe<Types.Scalars['String']['input']>;
  workflowRunId?: Types.InputMaybe<Types.Scalars['UUID']['input']>;
}>;


export type CreateMessageMutation = { __typename: 'Mutation', createMessage?: { __typename: 'CreateMessagePayload', message?: { __typename: 'Message', id: any, createdAt: any } | null } | null };

export type CreateMessageSourceMutationVariables = Types.Exact<{
  messageId: Types.Scalars['UUID']['input'];
  url: Types.Scalars['String']['input'];
  title: Types.Scalars['String']['input'];
  description?: Types.InputMaybe<Types.Scalars['String']['input']>;
  position: Types.Scalars['Int']['input'];
}>;


export type CreateMessageSourceMutation = { __typename: 'Mutation', createMessageSource?: { __typename: 'CreateMessageSourcePayload', messageSource?: { __typename: 'MessageSource', id: any } | null } | null };

export type UpdateChatByIdMutationVariables = Types.Exact<{
  id: Types.Scalars['UUID']['input'];
  title: Types.Scalars['String']['input'];
}>;


export type UpdateChatByIdMutation = { __typename: 'Mutation', updateChatById?: { __typename: 'UpdateChatPayload', chat?: { __typename: 'Chat', id: any } | null } | null };

export type GetMessagesByChatIdQueryVariables = Types.Exact<{
  chatId: Types.Scalars['UUID']['input'];
}>;


export type GetMessagesByChatIdQuery = { __typename: 'Query', chatById?: { __typename: 'Chat', id: any, messagesByChatId: { __typename: 'MessagesConnection', nodes: Array<{ __typename: 'Message', id: any, role: Types.MessageRole, content: string, createdAt: any, messageSourcesByMessageId: { __typename: 'MessageSourcesConnection', nodes: Array<{ __typename: 'MessageSource', id: any, url: string, title: string, description?: string | null, position: number } | null> } } | null> } } | null };
