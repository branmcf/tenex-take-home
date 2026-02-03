import { gql } from 'graphile-utils';
import {
    Either
    , error
    , success
} from '../../types';
import { ResourceError } from '../../errors';
import { postGraphileRequest } from '../../lib/postGraphile';
import {
    GetUserChatsQuery
    , GetUserChatsQueryVariables
    , DeleteChatMutation
    , DeleteChatMutationVariables
} from './chats.service.generatedTypes';
import {
    UserChatsNotFound
    , GetUserChatsFailed
    , ChatNotFound
    , DeleteChatFailed
} from './chats.errors';

/**
 * get all chats for a user from the database
 *
 * @param userId - the user id
 * @param limit - maximum number of chats to return
 * @param offset - number of chats to skip
 * @returns Either<ResourceError, GetUserChatsQuery['userById']> - the user's chats
 */
export const getUserChats = async (
    params: {
        userId: GetUserChatsQueryVariables['userId'];
        limit?: number;
        offset?: number;
    }
): Promise<Either<ResourceError, GetUserChatsQuery['userById']>> => {

    // create the graphql query
    const GET_USER_CHATS = gql`
        query getUserChats(
            $userId: String!
            $limit: Int
            $offset: Int
        ) {
            userById(id: $userId) {
                id
                chatsByUserId(
                    orderBy: UPDATED_AT_DESC
                    first: $limit
                    offset: $offset
                ) {
                    nodes {
                        id
                        title
                        updatedAt
                        deletedAt
                        messagesByChatId(
                            orderBy: CREATED_AT_ASC
                            first: 1
                            condition: { role: USER }
                        ) {
                            nodes {
                                id
                                content
                            }
                        }
                    }
                }
            }
        }
    `;

    // execute the graphql query
    const result = await postGraphileRequest<GetUserChatsQuery, GetUserChatsQueryVariables>(
        {
            query: GET_USER_CHATS
            , variables: {
                userId: params.userId
                , limit: params.limit ?? null
                , offset: params.offset ?? null
            }
        }
    );

    // check for error
    if ( result.isError() ) {

        // return the error
        return error( result.value );
    }

    // check for user
    if ( !result.value.userById ) {

        // return custom error
        return error( new GetUserChatsFailed() );
    }

    // check for chats
    if ( !result.value.userById.chatsByUserId?.nodes ) {

        // return custom error
        return error( new UserChatsNotFound() );
    }

    // return success
    return success( result.value.userById );

};

/**
 * soft delete a chat by setting deletedAt timestamp
 *
 * @param chatId - the chat id to delete
 * @returns Either<ResourceError, { success: boolean }> - success status
 */
export const deleteChat = async (
    chatId: DeleteChatMutationVariables['chatId']
): Promise<Either<ResourceError, { success: boolean }>> => {

    // create the graphql mutation
    const DELETE_CHAT = gql`
        mutation deleteChat($chatId: UUID!) {
            updateChatById(input: {
                id: $chatId
                chatPatch: {
                    deletedAt: "now()"
                }
            }) {
                chat {
                    id
                    deletedAt
                }
            }
        }
    `;

    // execute the graphql mutation
    const result = await postGraphileRequest<DeleteChatMutation, DeleteChatMutationVariables>(
        {
            mutation: DELETE_CHAT
            , variables: { chatId }
        }
    );

    // check for error
    if ( result.isError() ) {

        // return the error
        return error( result.value );
    }

    // check for chat
    if ( !result.value.updateChatById?.chat ) {

        // return custom error
        return error( new ChatNotFound() );
    }

    // return success
    return success( { success: true } );

};
