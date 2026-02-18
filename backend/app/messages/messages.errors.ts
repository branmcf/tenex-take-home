import { ResourceError } from '../../errors';

export class ChatNotFound extends ResourceError {
    public constructor () {
        const clientMessage = `Chat not found.`;
        const code = 'CHAT_NOT_FOUND';
        const statusCode = 404;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class MessagesNotFound extends ResourceError {
    public constructor () {
        const clientMessage = `No messages found for this chat.`;
        const code = 'MESSAGES_NOT_FOUND';
        const statusCode = 404;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class CreateMessageFailed extends ResourceError {
    public constructor () {
        const clientMessage = `Failed to create message.`;
        const code = 'CREATE_MESSAGE_FAILED';
        const statusCode = 500;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class CreateChatFailed extends ResourceError {
    public constructor () {
        const clientMessage = `Failed to create chat.`;
        const code = 'CREATE_CHAT_FAILED';
        const statusCode = 500;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class ModelNotFound extends ResourceError {
    public constructor () {
        const clientMessage = `Model not found.`;
        const code = 'MODEL_NOT_FOUND';
        const statusCode = 404;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class LLMRequestFailed extends ResourceError {
    public constructor () {
        const clientMessage = `Failed to get response from LLM.`;
        const code = 'LLM_REQUEST_FAILED';
        const statusCode = 500;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class ChatAccessForbidden extends ResourceError {
    public constructor () {
        const clientMessage = `You do not have permission to access this chat.`;
        const code = 'CHAT_ACCESS_FORBIDDEN';
        const statusCode = 403;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class WorkflowRunInProgress extends ResourceError {
    public constructor () {
        const clientMessage = 'A workflow is currently running for this chat. Please wait for it to finish.';
        const code = 'WORKFLOW_RUN_IN_PROGRESS';
        const statusCode = 409;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class WorkflowExecutionFailed extends ResourceError {
    public constructor () {
        const clientMessage = 'Workflow execution failed.';
        const code = 'WORKFLOW_EXECUTION_FAILED';
        const statusCode = 500;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class WorkflowRunTimeout extends ResourceError {
    public constructor () {
        const clientMessage = 'Timed out waiting for workflow run.';
        const code = 'WORKFLOW_RUN_TIMEOUT';
        const statusCode = 504;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class StreamingFailed extends ResourceError {
    public constructor () {
        const clientMessage = 'Streaming failed.';
        const code = 'STREAMING_FAILED';
        const statusCode = 500;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}
