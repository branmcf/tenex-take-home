import express from 'express';
import {
    requestHandlerErrorWrapper
    , requestValidator
} from '../../middleware';
import {
    getUserWorkflowsHandler
    , getWorkflowByIdHandler
    , createWorkflowHandler
    , updateWorkflowHandler
    , deleteWorkflowHandler
} from './workflows.ctrl';

// create an express router
export const workflowsRouter = express.Router( { mergeParams: true } );

// define the routes of the express router
workflowsRouter
    .get(
        '/users/:userId/workflows'
        , requestValidator( 'GET_USER_WORKFLOWS' )
        , requestHandlerErrorWrapper( getUserWorkflowsHandler )
    )
    .get(
        '/workflows/:workflowId'
        , requestValidator( 'GET_WORKFLOW_BY_ID' )
        , requestHandlerErrorWrapper( getWorkflowByIdHandler )
    )
    .post(
        '/workflows'
        , requestValidator( 'CREATE_WORKFLOW' )
        , requestHandlerErrorWrapper( createWorkflowHandler )
    )
    .patch(
        '/workflows/:workflowId'
        , requestValidator( 'UPDATE_WORKFLOW' )
        , requestHandlerErrorWrapper( updateWorkflowHandler )
    )
    .delete(
        '/workflows/:workflowId'
        , requestValidator( 'DELETE_WORKFLOW' )
        , requestHandlerErrorWrapper( deleteWorkflowHandler )
    );
