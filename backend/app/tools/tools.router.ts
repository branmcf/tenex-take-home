import express from 'express';
import {
    requestHandlerErrorWrapper
    , requestValidator
} from '../../middleware';
import {
    getToolsHandler
    , searchToolsHandler
    , getToolByIdHandler
} from './tools.ctrl';

export const toolsRouter = express.Router();

toolsRouter
    .get( '/', requestValidator( 'GET_TOOLS' ), requestHandlerErrorWrapper( getToolsHandler ) )
    .get( '/search', requestValidator( 'SEARCH_TOOLS' ), requestHandlerErrorWrapper( searchToolsHandler ) )
    .get( '/:toolId', requestValidator( 'GET_TOOL_BY_ID' ), requestHandlerErrorWrapper( getToolByIdHandler ) );
