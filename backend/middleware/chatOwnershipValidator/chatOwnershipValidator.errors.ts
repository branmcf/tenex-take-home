import { ResourceError } from '../../errors';

export class ChatNotFoundError extends ResourceError {
    public constructor () {
        const clientMessage = 'Chat with the given id not found.';
        const code = 'CHAT_NOT_FOUND';
        const statusCode = 404;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class ChatAccessDeniedError extends ResourceError {
    public constructor () {
        const clientMessage = 'Access denied to the specified chat.';
        const code = 'CHAT_ACCESS_DENIED';
        const statusCode = 403;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class ChatIdRequiredError extends ResourceError {
    public constructor () {
        const clientMessage = 'Chat ID is required.';
        const code = 'CHAT_ID_REQUIRED';
        const statusCode = 400;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}
