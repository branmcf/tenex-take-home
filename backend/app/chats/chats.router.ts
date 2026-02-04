import express from 'express';
import {
    requestHandlerErrorWrapper
    , requestValidator
    , chatOwnershipValidator
} from '../../middleware';
import { deleteChatHandler } from './chats.ctrl';
import { messagesRouter } from '../messages';

// create an express router
export const chatsRouter = express.Router( { mergeParams: true } );

// define the routes of the express router
chatsRouter
    .delete(
        '/:chatId'
        , requestValidator( 'DELETE_CHAT' )
        , chatOwnershipValidator
        , requestHandlerErrorWrapper( deleteChatHandler )
    );

// nested chat message routes - ownership validated for all nested routes
chatsRouter.use(
    '/:chatId/messages'
    , chatOwnershipValidator
    , messagesRouter
);
