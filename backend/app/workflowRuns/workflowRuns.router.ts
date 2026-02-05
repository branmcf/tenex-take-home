import express from 'express';
import {
    requestHandlerErrorWrapper
    , requestValidator
} from '../../middleware';
import {
    streamWorkflowRunHandler
    , getWorkflowRunsByChatIdHandler
} from './workflowRuns.ctrl';

// create an express router
export const workflowRunsRouter = express.Router( { mergeParams: true } );

// define routes
workflowRunsRouter
    .get(
        '/'
        , requestValidator( 'GET_WORKFLOW_RUNS' )
        , requestHandlerErrorWrapper( getWorkflowRunsByChatIdHandler )
    )
    .get(
        '/:workflowRunId/stream'
        , requestValidator( 'STREAM_WORKFLOW_RUN' )
        , requestHandlerErrorWrapper( streamWorkflowRunHandler )
    );
