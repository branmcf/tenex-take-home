import {
    Request
    , Response
    , NextFunction
} from 'express';
import { ResourceError, ServerInternalError } from '../errors';
import { RouteNotFoundError } from './server.errors';

export const serverErrorHandler = (
    err: ResourceError
    , _req: Request
    , res: Response<ResourceError>
    , _next: NextFunction
): Response<ResourceError> => {
    const internalError = new ServerInternalError();
    return res
        .status( internalError.statusCode )
        .json( internalError );
};

export const clientErrorHandler = (
    req: Request
    , res: Response
    , next: NextFunction
): Response<ResourceError> | void => {
    if ( req.xhr || !req.route ) {
        const routeNotFound = new RouteNotFoundError();
        return res
            .status( routeNotFound.statusCode )
            .json( routeNotFound );
    }

    return next( req );
};
