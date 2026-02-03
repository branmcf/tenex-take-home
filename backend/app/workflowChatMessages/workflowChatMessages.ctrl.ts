import { Response } from 'express';
import { ResourceError } from '../../errors';
import {
    getWorkflowChatMessages
    , createWorkflowChatMessage
} from './workflowChatMessages.service';
import {
    GetWorkflowChatMessagesRequest
    , GetWorkflowChatMessagesResponse
    , CreateWorkflowChatMessageRequest
    , CreateWorkflowChatMessageResponse
    , WorkflowChatMessageResponse
} from './workflowChatMessages.types';
import { generateWorkflowChatResponse } from './workflowChatMessages.helper';

/**
 * @title Get Workflow Chat Messages Handler
 * @notice Returns all chat messages for a workflow.
 * @param req Express request
 * @param res Express response
 */
export const getWorkflowChatMessagesHandler = async (
    req: GetWorkflowChatMessagesRequest
    , res: Response<ResourceError | GetWorkflowChatMessagesResponse>
): Promise<Response<ResourceError | GetWorkflowChatMessagesResponse>> => {

    // get the workflowId from the url params
    const { workflowId } = req.params;

    // get the workflow chat messages from the database
    const getWorkflowChatMessagesResult = await getWorkflowChatMessages( workflowId );

    // check for errors
    if ( getWorkflowChatMessagesResult.isError() ) {

        // return the error
        return res
            .status( getWorkflowChatMessagesResult.value.statusCode )
            .json( getWorkflowChatMessagesResult.value );
    }

    // get the messages nodes
    const messagesNodes = getWorkflowChatMessagesResult.value ?? [];

    // map the messages to response format, filtering out null values
    const messages: WorkflowChatMessageResponse[] = messagesNodes
        .filter( ( message ): message is NonNullable<typeof message> => message !== null )
        .map( message => {

            // map MessageRole enum to response role type
            const roleMap: Record<string, 'user' | 'assistant'> = {
                'USER': 'user'
                , 'ASSISTANT': 'assistant'
            };
            const role = roleMap[ message.role ] || 'assistant';

            // return the message in response format
            return {
                id: message.id
                , role
                , content: message.content
                , createdAt: message.createdAt
            };
        } );

    // return success
    return res.status( 200 ).json( { messages } );

};

/**
 * @title Create Workflow Chat Message Handler
 * @notice Creates a new user message and generates an assistant response for workflow authoring.
 * @param req Express request
 * @param res Express response
 */
export const createWorkflowChatMessageHandler = async (
    req: CreateWorkflowChatMessageRequest
    , res: Response<ResourceError | CreateWorkflowChatMessageResponse>
): Promise<Response<ResourceError | CreateWorkflowChatMessageResponse>> => {

    // get the workflowId from the url params
    const { workflowId } = req.params;

    // get the message content and modelId from the body
    const { content, modelId } = req.body;

    // create the user message
    const createUserMessageResult = await createWorkflowChatMessage( {
        workflowId
        , role: 'user'
        , content
        , modelId
    } );

    // check for errors
    if ( createUserMessageResult.isError() ) {

        // return the error
        return res
            .status( createUserMessageResult.value.statusCode )
            .json( createUserMessageResult.value );
    }

    // store the user message data
    const userMessageData = createUserMessageResult.value;

    // generate LLM response for workflow authoring
    const generateResponseResult = await generateWorkflowChatResponse( {
        userMessage: content
        , modelId
    } );

    // check for errors
    if ( generateResponseResult.isError() ) {

        // map the user message to response format
        const userMessage: WorkflowChatMessageResponse = {
            id: userMessageData.id
            , role: 'user'
            , content
            , createdAt: userMessageData.createdAt
        };

        // return partial success with user message (no assistant message)
        return res.status( 201 ).json( {
            userMessage
            , assistantMessage: null
            , workflowId
            , error: {
                message: 'LLM request failed'
                , code: 'LLM_ERROR'
            }
        } );
    }

    // store the LLM response data
    const llmResponseData = generateResponseResult.value;

    // create the assistant message
    const createAssistantMessageResult = await createWorkflowChatMessage( {
        workflowId
        , role: 'assistant'
        , content: llmResponseData.content
        , modelId
    } );

    // check for errors
    if ( createAssistantMessageResult.isError() ) {

        // return the error
        return res
            .status( createAssistantMessageResult.value.statusCode )
            .json( createAssistantMessageResult.value );
    }

    // store the assistant message data
    const assistantMessageData = createAssistantMessageResult.value;

    // map the user message to response format
    const userMessage: WorkflowChatMessageResponse = {
        id: userMessageData.id
        , role: 'user'
        , content
        , createdAt: userMessageData.createdAt
    };

    // map the assistant message to response format
    const assistantMessage: WorkflowChatMessageResponse = {
        id: assistantMessageData.id
        , role: 'assistant'
        , content: llmResponseData.content
        , createdAt: assistantMessageData.createdAt
    };

    // return success
    return res.status( 201 ).json( {
        userMessage
        , assistantMessage
        , workflowId
    } );

};
