import express from 'express';
import {
    requestHandlerErrorWrapper
    , requestValidator
} from '../../middleware';
import {
    getWorkflowChatMessagesHandler
    , createWorkflowChatMessageHandler
    , applyWorkflowProposalHandler
} from './workflowChatMessages.ctrl';

// create an express router
export const workflowChatMessagesRouter = express.Router( { mergeParams: true } );

// define the routes of the express router
workflowChatMessagesRouter
    .get(
        '/'
        , requestValidator( 'GET_WORKFLOW_CHAT_MESSAGES' )
        , requestHandlerErrorWrapper( getWorkflowChatMessagesHandler )
    )
    .post(
        '/'
        , requestValidator( 'CREATE_WORKFLOW_CHAT_MESSAGE' )
        , requestHandlerErrorWrapper( createWorkflowChatMessageHandler )
    )
    .post(
        '/apply'
        , requestValidator( 'APPLY_WORKFLOW_PROPOSAL' )
        , requestHandlerErrorWrapper( applyWorkflowProposalHandler )
    );
