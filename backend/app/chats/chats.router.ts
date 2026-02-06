import express from 'express';
import {
    requestHandlerErrorWrapper
    , requestValidator
    , chatOwnershipValidator
} from '../../middleware';
import { deleteChatHandler, streamChatEventsHandler } from './chats.ctrl';
import { messagesRouter } from '../messages';
import { workflowRunsRouter } from '../workflowRuns';

// create an express router
export const chatsRouter = express.Router( { mergeParams: true } );

// define the routes of the express router
chatsRouter
    .delete(
        '/:chatId'
        , requestValidator( 'DELETE_CHAT' )
        , chatOwnershipValidator
        , requestHandlerErrorWrapper( deleteChatHandler )
    )
    .get(
        '/:chatId/events'
        , chatOwnershipValidator
        , requestHandlerErrorWrapper( streamChatEventsHandler )
    );

// nested chat message routes - ownership validated for all nested routes
chatsRouter.use(
    '/:chatId/messages'
    , chatOwnershipValidator
    , messagesRouter
);

// workflow runs - ownership validated for all nested routes
chatsRouter.use(
    '/:chatId/workflow-runs'
    , chatOwnershipValidator
    , workflowRunsRouter
);
