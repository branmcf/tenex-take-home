import express from 'express';
import {
    requestHandlerErrorWrapper
    , requestValidator
    , userIdValidator
} from '../../middleware';
import { getUserChatsHandler } from '../chats/chats.ctrl';
import { getUserWorkflowsHandler } from '../workflows/workflows.ctrl';

// create an express router
export const usersRouter = express.Router( { mergeParams: true } );

// define the routes of the express router
usersRouter
    .get(
        '/:userId/chats'
        , requestValidator( 'GET_USER_CHATS' )
        , userIdValidator
        , requestHandlerErrorWrapper( getUserChatsHandler )
    )
    .get(
        '/:userId/workflows'
        , requestValidator( 'GET_USER_WORKFLOWS' )
        , userIdValidator
        , requestHandlerErrorWrapper( getUserWorkflowsHandler )
    );
