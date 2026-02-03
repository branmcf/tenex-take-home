import express from 'express';
import {
    requestHandlerErrorWrapper
    , requestValidator
} from '../../middleware';
import { getUserChatsHandler, deleteChatHandler } from './chats.ctrl';

// create an express router
export const chatsRouter = express.Router( { mergeParams: true } );

// define the routes of the express router
chatsRouter
    .get(
        '/users/:userId/chats'
        , requestValidator( 'GET_USER_CHATS' )
        , requestHandlerErrorWrapper( getUserChatsHandler )
    )
    .delete(
        '/chats/:chatId'
        , requestValidator( 'DELETE_CHAT' )
        , requestHandlerErrorWrapper( deleteChatHandler )
    );
