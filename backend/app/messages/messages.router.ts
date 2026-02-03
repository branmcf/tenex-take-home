import express from 'express';
import {
    requestHandlerErrorWrapper
    , requestValidator
} from '../../middleware';
import {
    createMessageHandler
    , createMessageStreamHandler
    , getMessagesByChatIdHandler
} from './messages.ctrl';

// create an express router
export const messagesRouter = express.Router( { mergeParams: true } );

// define the routes of the express router
messagesRouter
    .post(
        '/'
        , requestValidator( 'CREATE_MESSAGE' )
        , requestHandlerErrorWrapper( createMessageHandler )
    )
    .post(
        '/stream'
        , requestValidator( 'CREATE_MESSAGE' )
        , requestHandlerErrorWrapper( createMessageStreamHandler )
    )
    .get(
        '/'
        , requestValidator( 'GET_MESSAGES_BY_CHAT_ID' )
        , requestHandlerErrorWrapper( getMessagesByChatIdHandler )
    );
