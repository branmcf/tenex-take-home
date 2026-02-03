import { ResourceError } from '../../errors';

export class UserChatsNotFound extends ResourceError {
    public constructor () {
        const clientMessage = `No chats found for user.`;
        const code = 'USER_CHATS_NOT_FOUND';
        const statusCode = 404;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class GetUserChatsFailed extends ResourceError {
    public constructor () {
        const clientMessage = `Failed to retrieve user chats.`;
        const code = 'GET_USER_CHATS_FAILED';
        const statusCode = 500;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

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

export class DeleteChatFailed extends ResourceError {
    public constructor () {
        const clientMessage = `Failed to delete chat.`;
        const code = 'DELETE_CHAT_FAILED';
        const statusCode = 500;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}
