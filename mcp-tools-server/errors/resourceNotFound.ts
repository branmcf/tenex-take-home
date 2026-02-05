import { ResourceError } from './resourceError';

export class ResourceNotFoundError extends ResourceError {
    public constructor () {
        super( {
            message: 'Resource not found.'
            , clientMessage: 'Resource not found.'
            , statusCode: 404
            , code: 'RESOURCE_NOT_FOUND'
        } );
    }
}
