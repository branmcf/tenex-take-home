import { Response, NextFunction } from 'express';
import { ResourceError } from '../../errors';
import { getUserChats, deleteChat } from './chats.service';
import {
    GetUserChatsRequest
    , GetUserChatsResponse
    , ChatItem
    , DeleteChatRequest
    , DeleteChatResponse
    , StreamChatEventsRequest
} from './chats.types';
import { chatEvents } from '../../lib/chatEvents';

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

/**
 * Timeout in milliseconds for chat event streams (30 seconds)
 */
const CHAT_EVENTS_TIMEOUT_MS = 30000;

/**
 * @title Stream Chat Events Handler
 * @notice Streams chat events (like title updates) via SSE.
 * @param req Express request
 * @param res Express response
 */
export const streamChatEventsHandler = async (
    req: StreamChatEventsRequest
    , res: Response<ResourceError>
    , _next: NextFunction
): Promise<Response<ResourceError>> => {

    // get params
    const { chatId } = req.params;

    // set headers for SSE
    res.setHeader( 'Content-Type', 'text/event-stream' );
    res.setHeader( 'Cache-Control', 'no-cache' );
    res.setHeader( 'Connection', 'keep-alive' );

    // ensure headers are flushed
    if ( typeof res.flushHeaders === 'function' ) {
        res.flushHeaders();
    }

    let isClosed = false;

    // helper to send SSE data
    const sendEvent = ( payload: Record<string, unknown> ) => {
        if ( !isClosed ) {
            res.write( `data: ${ JSON.stringify( payload ) }\n\n` );
        }
    };

    // send initial connected event
    sendEvent( { type: 'connected', chatId } );

    // subscribe to title updates for this chat
    const unsubscribe = chatEvents.onTitleUpdated( chatId, ( data ) => {
        sendEvent( {
            type: 'title_updated'
            , chatId: data.chatId
            , title: data.title
        } );

        // close the connection after sending the title
        // (frontend only needs one title update per new chat)
        cleanup();
    } );

    // set timeout to close connection if no title arrives
    const timeoutId = setTimeout( () => {
        if ( !isClosed ) {
            sendEvent( { type: 'timeout' } );
            cleanup();
        }
    }, CHAT_EVENTS_TIMEOUT_MS );

    // cleanup function
    const cleanup = () => {
        if ( isClosed ) return;
        isClosed = true;
        clearTimeout( timeoutId );
        unsubscribe();
        res.end();
    };

    // handle client disconnect
    req.on( 'close', cleanup );

    // return the response (SSE keeps it open)
    return res;

};
