import { ResourceError } from './resourceError';

export class ServerInternalError extends ResourceError {
    public constructor ( message?: string, error?: Error | unknown ) {
        if ( !message ) {
            message = 'The server encountered an unspecified internal error.';
        }

        const statusCode = 500;
        const code = 'SERVER_INTERNAL_ERROR';
        super( {
            message
            , error
            , code
            , statusCode
        } );
    }
}