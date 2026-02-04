import { ResourceError } from '../../errors';

export class UserIdMismatchError extends ResourceError {
    public constructor () {
        const clientMessage = 'Access denied. You can only access your own resources.';
        const code = 'USER_ID_MISMATCH';
        const statusCode = 403;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class UserIdRequiredError extends ResourceError {
    public constructor () {
        const clientMessage = 'User ID is required.';
        const code = 'USER_ID_REQUIRED';
        const statusCode = 400;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}
