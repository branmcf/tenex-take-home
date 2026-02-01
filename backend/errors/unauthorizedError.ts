import { ResourceError } from '.';
import { ErrorConstructorParams } from '../types';

export class UnauthorizedError extends ResourceError {
    public constructor ( params?: ErrorConstructorParams | null ) {
        const message = 'Authentication is required and has failed or has not yet been provided.';
        const code = 'UNAUTHORIZED';
        const statusCode = 401;
        super( {
            message: params?.message || message
            , code: params?.code || code
            , statusCode: params?.statusCode || statusCode
            , error: params?.error
        } );
    }
}