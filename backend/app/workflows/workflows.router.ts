import express from 'express';
import {
    requestHandlerErrorWrapper
    , requestValidator
    , workflowOwnershipValidator
} from '../../middleware';
import {
    getWorkflowByIdHandler
    , createWorkflowHandler
    , updateWorkflowHandler
    , deleteWorkflowHandler
} from './workflows.ctrl';
import { workflowChatMessagesRouter } from '../workflowChatMessages';

// create an express router
export const workflowsRouter = express.Router( { mergeParams: true } );

// define the routes of the express router
workflowsRouter
    .get(
        '/:workflowId'
        , requestValidator( 'GET_WORKFLOW_BY_ID' )
        , workflowOwnershipValidator
        , requestHandlerErrorWrapper( getWorkflowByIdHandler )
    )
    .post(
        '/'
        , requestValidator( 'CREATE_WORKFLOW' )
        , requestHandlerErrorWrapper( createWorkflowHandler )
    )
    .patch(
        '/:workflowId'
        , requestValidator( 'UPDATE_WORKFLOW' )
        , workflowOwnershipValidator
        , requestHandlerErrorWrapper( updateWorkflowHandler )
    )
    .delete(
        '/:workflowId'
        , requestValidator( 'DELETE_WORKFLOW' )
        , workflowOwnershipValidator
        , requestHandlerErrorWrapper( deleteWorkflowHandler )
    );

// workflow chat messages - ownership validated for all nested routes
workflowsRouter.use(
    '/:workflowId/messages'
    , workflowOwnershipValidator
    , workflowChatMessagesRouter
);
