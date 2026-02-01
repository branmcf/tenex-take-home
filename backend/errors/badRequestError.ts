import { ResourceError } from '.';
import { ErrorConstructorParams } from '../types';

export class BadRequest extends ResourceError {
    public constructor ( params: ErrorConstructorParams | null ) {
        const message = 'Invalid data provided in the request.';
        const code = 'BAD_REQUEST';
        const statusCode = 400;
        super( {
            message: params?.message || message
            , code: params?.code || code
            , statusCode: params?.statusCode || statusCode
            , error: params?.error
        } );
    }
}
