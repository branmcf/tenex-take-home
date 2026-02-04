import { gql } from 'graphile-utils';
import {
    Either
    , error
    , success
} from '../../types';
import { ResourceError } from '../../errors';
import { postGraphileRequest } from '../../lib/postGraphile';
import { MessageRole } from '../../lib/postGraphile/postGraphile.generatedTypes';
import {
    GetWorkflowChatMessagesFailed
    , CreateWorkflowChatMessageFailed
} from './workflowChatMessages.errors';
import {
    CreateWorkflowChatMessageMutation
    , CreateWorkflowChatMessageMutationVariables
    , GetWorkflowChatMessagesQuery
    , GetWorkflowChatMessagesQueryVariables
} from './workflowChatMessages.service.generatedTypes';

/**
 * get all chat messages for a workflow from the database
 *
 * @param workflowId - the workflow id
 * @returns Either<ResourceError, messages array> - the workflow's chat messages
 */
export const getWorkflowChatMessages = async (
    workflowId: string
): Promise<Either<ResourceError, NonNullable<GetWorkflowChatMessagesQuery['workflowById']>['workflowChatMessagesByWorkflowId']['nodes']>> => {

    // create the graphql query
    const GET_WORKFLOW_CHAT_MESSAGES = gql`
        query getWorkflowChatMessages($workflowId: UUID!) {
            workflowById(id: $workflowId) {
                id
                workflowChatMessagesByWorkflowId(
                    orderBy: CREATED_AT_ASC
                ) {
                    nodes {
                        id
                        role
                        content
                        createdAt
                    }
                }
            }
        }
    `;

    // execute the graphql query
    const result = await postGraphileRequest<GetWorkflowChatMessagesQuery, GetWorkflowChatMessagesQueryVariables>(
        {
            query: GET_WORKFLOW_CHAT_MESSAGES
            , variables: { workflowId }
        }
    );

    // check for error
    if ( result.isError() ) {

        // return the error
        return error( result.value );
    }

    // check for workflow
    if ( !result.value.workflowById ) {

        // return custom error
        return error( new GetWorkflowChatMessagesFailed() );
    }

    // return success with messages array (can be empty)
    return success( result.value.workflowById.workflowChatMessagesByWorkflowId.nodes );

};

/**
 * create a new workflow chat message in the database
 *
 * @param params - the message parameters
 * @returns Either<ResourceError, { id, role, content, createdAt }> - the created message
 */
export const createWorkflowChatMessage = async (
    params: {
        workflowId: string;
        role: 'user' | 'assistant';
        content: string;
        modelId?: string;
    }
): Promise<Either<ResourceError, { id: string; role: string; content: string; createdAt: string }>> => {

    // map role to GraphQL MessageRole enum
    const roleMap: Record<string, MessageRole> = {
        user: MessageRole.User
        , assistant: MessageRole.Assistant
    };
    const graphqlRole = roleMap[ params.role ];

    // create the graphql mutation
    const CREATE_WORKFLOW_CHAT_MESSAGE = gql`
        mutation createWorkflowChatMessage(
            $workflowId: UUID!
            $role: MessageRole!
            $content: String!
            $modelId: String
        ) {
            createWorkflowChatMessage(input: {
                workflowChatMessage: {
                    workflowId: $workflowId
                    role: $role
                    content: $content
                    modelId: $modelId
                }
            }) {
                workflowChatMessage {
                    id
                    role
                    content
                    createdAt
                }
            }
        }
    `;

    // execute the graphql mutation
    const result = await postGraphileRequest<CreateWorkflowChatMessageMutation, CreateWorkflowChatMessageMutationVariables>(
        {
            mutation: CREATE_WORKFLOW_CHAT_MESSAGE
            , variables: {
                workflowId: params.workflowId
                , role: graphqlRole
                , content: params.content
                , modelId: params.modelId ?? null
            }
        }
    );

    // check for error
    if ( result.isError() ) {

        // return the error
        return error( result.value );
    }

    // check for falsy createWorkflowChatMessage
    if ( !result.value.createWorkflowChatMessage?.workflowChatMessage ) {

        // return custom error
        return error( new CreateWorkflowChatMessageFailed() );
    }

    // extract the message data
    const messageData = result.value.createWorkflowChatMessage.workflowChatMessage;

    // return success
    return success( {
        id: messageData.id
        , role: messageData.role
        , content: messageData.content
        , createdAt: messageData.createdAt
    } );

};
