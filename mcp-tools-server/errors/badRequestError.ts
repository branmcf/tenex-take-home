import { ResourceError } from './resourceError';

export class BadRequestError extends ResourceError {
    public constructor ( message?: string ) {
        super( {
            message: message ?? 'Bad request.'
            , clientMessage: message ?? 'Bad request.'
            , statusCode: 400
            , code: 'BAD_REQUEST'
        } );
    }
}
