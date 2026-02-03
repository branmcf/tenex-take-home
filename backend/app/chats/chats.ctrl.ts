import { Response } from 'express';
import { ResourceError } from '../../errors';
import { getUserChats, deleteChat } from './chats.service';
import {
    GetUserChatsRequest
    , GetUserChatsResponse
    , ChatItem
    , DeleteChatRequest
    , DeleteChatResponse
} from './chats.types';

/**
 * @title Get User Chats Handler
 * @notice Returns all chats for a user with optional pagination.
 * @param req Express request
 * @param res Express response
 */
export const getUserChatsHandler = async (
    req: GetUserChatsRequest
    , res: Response<ResourceError | GetUserChatsResponse>
): Promise<Response<ResourceError | GetUserChatsResponse>> => {

    // get the userId from the url params
    const { userId } = req.params;

    // get the pagination params from the query
    const limit = req.query.limit ? parseInt( req.query.limit, 10 ) : undefined;
    const offset = req.query.offset ? parseInt( req.query.offset, 10 ) : undefined;

    // get the user chats from the database
    const getUserChatsResult = await getUserChats( {
        userId
        , limit
        , offset
    } );

    // check for errors
    if ( getUserChatsResult.isError() ) {

        // return the error
        return res
            .status( getUserChatsResult.value.statusCode )
            .json( getUserChatsResult.value );
    }

    // get the chats nodes
    const chatsNodes = getUserChatsResult.value?.chatsByUserId?.nodes ?? [];

    // map the chats to response format, filtering out deleted chats
    const chats: ChatItem[] = chatsNodes
        .filter( ( chat ): chat is NonNullable<typeof chat> => chat !== null && !chat.deletedAt )
        .map( chat => {

            // get the first user message for snippet
            const firstMessage = chat.messagesByChatId?.nodes?.[ 0 ];
            const snippet = firstMessage?.content;

            // return the chat in response format
            return {
                id: chat.id
                , title: chat.title ?? null
                , snippet
                , updatedAt: chat.updatedAt
            };
        } );

    // return success
    return res.status( 200 ).json( { chats } );

};

/**
 * @title Delete Chat Handler
 * @notice Soft deletes a chat by setting deletedAt timestamp.
 * @param req Express request
 * @param res Express response
 */
export const deleteChatHandler = async (
    req: DeleteChatRequest
    , res: Response<ResourceError | DeleteChatResponse>
): Promise<Response<ResourceError | DeleteChatResponse>> => {

    // get the chatId from the url params
    const { chatId } = req.params;

    // delete the chat from the database
    const deleteChatResult = await deleteChat( chatId );

    // check for errors
    if ( deleteChatResult.isError() ) {

        // return the error
        return res
            .status( deleteChatResult.value.statusCode )
            .json( deleteChatResult.value );
    }

    // return success
    return res.status( 200 ).json( { success: true } );

};
