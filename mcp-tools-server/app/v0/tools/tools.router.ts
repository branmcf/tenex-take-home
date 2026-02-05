import express from 'express';
import { requestHandlerErrorWrapper, requestValidator } from '../../../middleware';
import { handleMcpToolsRequest } from './tools.ctrl';

export const toolsRouter = express.Router();

toolsRouter.post(
    '/mcp'
    , requestValidator( 'MCP_REQUEST' )
    , requestHandlerErrorWrapper( handleMcpToolsRequest )
);
