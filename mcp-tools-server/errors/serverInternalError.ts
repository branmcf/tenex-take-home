import { ResourceError } from './resourceError';

export class ServerInternalError extends ResourceError {
    public constructor () {
        super( {
            message: 'Internal server error.'
            , clientMessage: 'Internal server error.'
            , statusCode: 500
            , code: 'INTERNAL_SERVER_ERROR'
        } );
    }
}
