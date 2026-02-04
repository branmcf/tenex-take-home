import { ResourceError } from '../errors';

export class RouteNotFoundError extends ResourceError {
    public constructor () {
        super( {
            message: 'Route not found.'
            , clientMessage: 'Route not found.'
            , statusCode: 404
            , code: 'ROUTE_NOT_FOUND'
        } );
    }
}
