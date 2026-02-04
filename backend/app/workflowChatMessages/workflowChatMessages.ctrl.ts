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
    , ApplyWorkflowProposalRequest
    , ApplyWorkflowProposalResponse
} from './workflowChatMessages.types';
import { generateWorkflowChatResponse } from './workflowChatMessages.helper';
import { getWorkflowProposal, removeWorkflowProposal } from '../../lib/workflowProposals';
import { createWorkflowVersion, getLatestWorkflowVersion } from '../workflows/workflows.service';
import { updateWorkflowMetadataIfAuto } from '../workflows/workflows.helper';
import { WorkflowProposalApplyFailed, WorkflowProposalVersionMismatch } from './workflowChatMessages.errors';
import { WorkflowDAG } from '../../lib/workflowDags';
import { getCachedTools } from '../tools/tools.helper';
import { validateWorkflowDag } from '../../lib/workflowDags';

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
        workflowId
        , userMessage: content
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
        , proposedChanges: llmResponseData.proposedChanges
    } );

};

/**
 * @title Apply Workflow Proposal Handler
 * @notice Applies a workflow proposal and creates a new workflow version.
 * @param req Express request
 * @param res Express response
 */
export const applyWorkflowProposalHandler = async (
    req: ApplyWorkflowProposalRequest
    , res: Response<ResourceError | ApplyWorkflowProposalResponse>
): Promise<Response<ResourceError | ApplyWorkflowProposalResponse>> => {

    // get params and body
    const { workflowId } = req.params;
    const { proposalId } = req.body;

    // get the proposal
    const proposalResult = await getWorkflowProposal( proposalId );

    if ( proposalResult.isError() ) {
        return res
            .status( proposalResult.value.statusCode )
            .json( proposalResult.value );
    }

    const proposal = proposalResult.value;

    // ensure proposal matches workflow
    if ( proposal.workflowId !== workflowId ) {
        return res
            .status( 400 )
            .json( new WorkflowProposalApplyFailed() );
    }

    // ensure workflow version is unchanged
    const latestVersionResult = await getLatestWorkflowVersion( workflowId );

    if ( latestVersionResult.isError() ) {
        return res
            .status( latestVersionResult.value.statusCode )
            .json( latestVersionResult.value );
    }

    const latestVersionId = latestVersionResult.value?.id ?? null;

    if ( proposal.baseVersionId !== latestVersionId ) {
        return res
            .status( 409 )
            .json( new WorkflowProposalVersionMismatch() );
    }

    const proposedDag = proposal.proposedDag as { steps?: Array<{ id: string; name: string; instruction: string; tools?: Array<{ id: string; name?: string; version?: string }>; dependsOn?: string[] }> };

    // validate proposed dag before applying
    let availableTools: Array<{ id: string; name: string; version: string }> = [];
    let cachedToolsResult = await getCachedTools( false );

    if ( cachedToolsResult.isError() ) {
        console.warn( 'workflow proposal: failed to load cached tools, continuing without tools', cachedToolsResult.value );
    } else if ( cachedToolsResult.value.length > 0 ) {
        availableTools = cachedToolsResult.value.map( tool => ( {
            id: tool.externalId ?? tool.id
            , name: tool.name
            , version: tool.version ?? '1.0.0'
        } ) );
    } else {
        cachedToolsResult = await getCachedTools( true );
        if ( cachedToolsResult.isError() ) {
            console.warn( 'workflow proposal: failed to refresh tools, continuing without tools', cachedToolsResult.value );
        } else {
            availableTools = cachedToolsResult.value.map( tool => ( {
                id: tool.externalId ?? tool.id
                , name: tool.name
                , version: tool.version ?? '1.0.0'
            } ) );
        }
    }

    const validationResult = validateWorkflowDag( {
        dag: proposedDag as unknown as WorkflowDAG
        , validTools: availableTools
    } );

    if ( validationResult.isError() ) {
        return res
            .status( validationResult.value.statusCode )
            .json( validationResult.value );
    }

    // create new workflow version
    const createVersionResult = await createWorkflowVersion( workflowId, proposal.proposedDag );

    if ( createVersionResult.isError() ) {
        return res
            .status( createVersionResult.value.statusCode )
            .json( createVersionResult.value );
    }

    const createdVersion = createVersionResult.value;

    const steps = ( proposedDag.steps ?? [] ).map( ( step, index ) => ( {
        id: step.id
        , name: step.name
        , prompt: step.instruction
        , tools: ( step.tools ?? [] ).map( tool => ( {
            id: tool.id
            , name: tool.name ?? tool.id
            , version: tool.version
        } ) )
        , order: index + 1
    } ) );

    // update workflow metadata if auto
    const metadataUpdateResult = await updateWorkflowMetadataIfAuto( {
        workflowId
        , userMessage: proposal.userMessage
        , modelId: proposal.modelId ?? 'gpt-4o'
        , dag: proposedDag as unknown as WorkflowDAG
    } );

    if ( metadataUpdateResult.isError() ) {
        return res
            .status( metadataUpdateResult.value.statusCode )
            .json( metadataUpdateResult.value );
    }

    // remove proposal after apply
    await removeWorkflowProposal( proposalId );

    return res.status( 200 ).json( {
        success: true
        , workflowVersion: {
            id: createdVersion.id
            , versionNumber: createdVersion.versionNumber
            , steps
        }
    } );

};
