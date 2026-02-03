import { ResourceError } from '../../errors';

export class WorkflowChatMessagesNotFound extends ResourceError {
    public constructor () {
        const clientMessage = `No chat messages found for this workflow.`;
        const code = 'WORKFLOW_CHAT_MESSAGES_NOT_FOUND';
        const statusCode = 404;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class GetWorkflowChatMessagesFailed extends ResourceError {
    public constructor () {
        const clientMessage = `Failed to retrieve workflow chat messages.`;
        const code = 'GET_WORKFLOW_CHAT_MESSAGES_FAILED';
        const statusCode = 500;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class CreateWorkflowChatMessageFailed extends ResourceError {
    public constructor () {
        const clientMessage = `Failed to create workflow chat message.`;
        const code = 'CREATE_WORKFLOW_CHAT_MESSAGE_FAILED';
        const statusCode = 500;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class WorkflowChatLLMRequestFailed extends ResourceError {
    public constructor () {
        const clientMessage = `Failed to get a response from the AI model.`;
        const code = 'WORKFLOW_CHAT_LLM_REQUEST_FAILED';
        const statusCode = 500;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}
