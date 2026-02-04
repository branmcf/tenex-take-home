import { ResourceError } from './resourceError';

export class UnauthorizedError extends ResourceError {
    public constructor () {
        super( {
            message: 'Unauthorized.'
            , clientMessage: 'Unauthorized.'
            , statusCode: 401
            , code: 'UNAUTHORIZED'
        } );
    }
}
