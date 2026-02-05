import { gql } from 'graphile-utils';
import {
    Either
    , error
    , success
} from '../../types';
import { ResourceError } from '../../errors';
import { postGraphileRequest } from '../../lib/postGraphile';
import { MessageRole } from '../../lib/postGraphile/postGraphile.generatedTypes';
import {
    GetChatByIdQuery
    , GetChatByIdQueryVariables
    , CreateChatMutation
    , CreateChatMutationVariables
    , CreateMessageMutation
    , CreateMessageMutationVariables
    , GetMessagesByChatIdQuery
    , GetMessagesByChatIdQueryVariables
    , CreateMessageSourceMutation
    , CreateMessageSourceMutationVariables
} from './messages.service.generatedTypes';
import {
    ChatNotFound
    , CreateChatFailed
    , CreateMessageFailed
    , MessagesNotFound
} from './messages.errors';

/**
 * get chat by id from the database
 *
 * @param chatId - the chat id
 * @returns Either<ResourceError, GetChatByIdQuery['chatById']> - the chat
 */
export const getChatById = async (
    chatId: GetChatByIdQueryVariables['chatId']
): Promise<Either<ResourceError, GetChatByIdQuery['chatById']>> => {

    // create the graphql query
    const GET_CHAT_BY_ID = gql`
        query getChatById($chatId: UUID!) {
            chatById(id: $chatId) {
                id
                userId
                title
                createdAt
                updatedAt
            }
        }
    `;

    // execute the graphql query
    const result = await postGraphileRequest<GetChatByIdQuery, GetChatByIdQueryVariables>(
        {
            query: GET_CHAT_BY_ID
            , variables: { chatId }
        }
    );

    // check for error
    if ( result.isError() ) {

        // return the error
        return error( result.value );
    }

    // check for chat
    if ( !result.value.chatById ) {

        // return custom error
        return error( new ChatNotFound() );
    }

    // return success
    return success( result.value.chatById );

};

/**
 * create a new chat in the database
 *
 * @param params - the chat parameters
 * @returns Either<ResourceError, { id: string }> - the created chat id
 */
export const createChat = async (
    params: {
        id: string;
        userId: string;
        title?: string;
    }
): Promise<Either<ResourceError, { id: string }>> => {

    // create the graphql mutation
    const CREATE_CHAT = gql`
        mutation createChat(
            $id: UUID!
            $userId: String!
            $title: String
        ) {
            createChat(input: {
                chat: {
                    id: $id
                    userId: $userId
                    title: $title
                }
            }) {
                chat {
                    id
                }
            }
        }
    `;

    // execute the graphql mutation
    const result = await postGraphileRequest<CreateChatMutation, CreateChatMutationVariables>(
        {
            mutation: CREATE_CHAT
            , variables: {
                id: params.id
                , userId: params.userId
                , title: params.title ?? null
            }
        }
    );

    // check for error
    if ( result.isError() ) {

        // return the error
        return error( result.value );
    }

    // check for falsy createChat
    if ( !result.value.createChat?.chat ) {

        // return custom error
        return error( new CreateChatFailed() );
    }

    // return success with chat id
    return success( { id: result.value.createChat.chat.id } );

};

/**
 * create a new message in the database
 *
 * @param params - the message parameters
 * @returns Either<ResourceError, { id: string; createdAt: string }> - the created message
 */
export const createMessage = async (
    params: {
        chatId: string;
        role: 'user' | 'assistant' | 'system';
        content: string;
        modelId?: string;
        workflowRunId?: string;
    }
): Promise<Either<ResourceError, { id: string; createdAt: string }>> => {

    // map role to GraphQL MessageRole enum
    const roleMap: Record<string, MessageRole> = {
        user: MessageRole.User
        , assistant: MessageRole.Assistant
        , system: MessageRole.System
    };
    const graphqlRole = roleMap[params.role];

    // create the graphql mutation
    const CREATE_MESSAGE = gql`
        mutation createMessage(
            $chatId: UUID!
            $role: MessageRole!
            $content: String!
            $modelId: String
            $workflowRunId: UUID
        ) {
            createMessage(input: {
                message: {
                    chatId: $chatId
                    role: $role
                    content: $content
                    modelId: $modelId
                    workflowRunId: $workflowRunId
                }
            }) {
                message {
                    id
                    createdAt
                }
            }
        }
    `;

    // execute the graphql mutation
    const result = await postGraphileRequest<CreateMessageMutation, CreateMessageMutationVariables>(
        {
            mutation: CREATE_MESSAGE
            , variables: {
                chatId: params.chatId
                , role: graphqlRole
                , content: params.content
                , modelId: params.modelId ?? null
                , workflowRunId: params.workflowRunId ?? null
            }
        }
    );

    // check for error
    if ( result.isError() ) {

        // return the error
        return error( result.value );
    }

    // check for falsy createMessage
    if ( !result.value.createMessage?.message ) {

        // return custom error
        return error( new CreateMessageFailed() );
    }

    // extract the message data
    const messageData = result.value.createMessage.message;

    // return success with message id and createdAt
    return success( {
        id: messageData.id
        , createdAt: messageData.createdAt
    } );

};

/**
 * create a message source in the database
 *
 * @param params - the message source parameters
 * @returns Either<ResourceError, { id: string }> - the created message source id
 */
export const createMessageSource = async (
    params: {
        messageId: string;
        url: string;
        title: string;
        description?: string;
        position: number;
    }
): Promise<Either<ResourceError, { id: string }>> => {

    // create the graphql mutation
    const CREATE_MESSAGE_SOURCE = gql`
        mutation createMessageSource(
            $messageId: UUID!
            $url: String!
            $title: String!
            $description: String
            $position: Int!
        ) {
            createMessageSource(input: {
                messageSource: {
                    messageId: $messageId
                    url: $url
                    title: $title
                    description: $description
                    position: $position
                }
            }) {
                messageSource {
                    id
                }
            }
        }
    `;

    // execute the graphql mutation
    const result = await postGraphileRequest<CreateMessageSourceMutation, CreateMessageSourceMutationVariables>(
        {
            mutation: CREATE_MESSAGE_SOURCE
            , variables: {
                messageId: params.messageId
                , url: params.url
                , title: params.title
                , description: params.description ?? null
                , position: params.position
            }
        }
    );

    // check for error
    if ( result.isError() ) {

        // return the error
        return error( result.value );
    }

    // check for falsy createMessageSource
    if ( !result.value.createMessageSource?.messageSource ) {

        // return custom error
        return error( new CreateMessageFailed() );
    }

    // return success with message source id
    return success( { id: result.value.createMessageSource.messageSource.id } );

};

/**
 * update a chat's title in the database
 *
 * @param params - the chat update parameters
 * @returns Either<ResourceError, { id: string }> - the updated chat id
 */
export const updateChatTitle = async (
    params: {
        chatId: string;
        title: string;
    }
): Promise<Either<ResourceError, { id: string }>> => {

    // create the graphql mutation
    const UPDATE_CHAT = gql`
        mutation updateChatById(
            $id: UUID!
            $title: String!
        ) {
            updateChatById(input: {
                id: $id
                chatPatch: {
                    title: $title
                }
            }) {
                chat {
                    id
                }
            }
        }
    `;

    // execute the graphql mutation
    const result = await postGraphileRequest<any, any>(
        {
            mutation: UPDATE_CHAT
            , variables: {
                id: params.chatId
                , title: params.title
            }
        }
    );

    // check for error
    if ( result.isError() ) {

        // return the error
        return error( result.value );
    }

    // check for falsy updateChatById
    if ( !result.value.updateChatById?.chat ) {

        // return custom error
        return error( new CreateChatFailed() );
    }

    // return success with chat id
    return success( { id: result.value.updateChatById.chat.id } );

};

/**
 * get all messages for a chat from the database
 *
 * @param chatId - the chat id
 * @returns Either<ResourceError, GetMessagesByChatIdQuery['chatById']> - the messages
 */
export const getMessagesByChatId = async (
    chatId: GetMessagesByChatIdQueryVariables['chatId']
): Promise<Either<ResourceError, GetMessagesByChatIdQuery['chatById']>> => {

    // create the graphql query
    const GET_MESSAGES_BY_CHAT_ID = gql`
        query getMessagesByChatId($chatId: UUID!) {
            chatById(id: $chatId) {
                id
                messagesByChatId(
                    orderBy: CREATED_AT_ASC
                ) {
                    nodes {
                        id
                        role
                        content
                        createdAt
                        messageSourcesByMessageId(
                            orderBy: POSITION_ASC
                        ) {
                            nodes {
                                id
                                url
                                title
                                description
                                position
                            }
                        }
                    }
                }
            }
        }
    `;

    // execute the graphql query
    const result = await postGraphileRequest<GetMessagesByChatIdQuery, GetMessagesByChatIdQueryVariables>(
        {
            query: GET_MESSAGES_BY_CHAT_ID
            , variables: { chatId }
        }
    );

    // check for error
    if ( result.isError() ) {

        // return the error
        return error( result.value );
    }

    // check for chat
    if ( !result.value.chatById ) {

        // return custom error
        return error( new ChatNotFound() );
    }

    // check for messages
    if ( !result.value.chatById.messagesByChatId?.nodes?.length ) {

        // return custom error
        return error( new MessagesNotFound() );
    }

    // return success
    return success( result.value.chatById );

};
