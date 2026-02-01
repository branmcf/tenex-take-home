import { ResourceError } from '.';
import { ErrorConstructorParams } from '../types';

export class ForbiddenError extends ResourceError {
    public constructor ( params?: ErrorConstructorParams | null ) {
        const message = 'You do not have permission to access this resource.';
        const code = 'FORBIDDEN';
        const statusCode = 403;
        super( {
            message: params?.message || message
            , code: params?.code || code
            , statusCode: params?.statusCode || statusCode
            , error: params?.error
        } );
    }
}