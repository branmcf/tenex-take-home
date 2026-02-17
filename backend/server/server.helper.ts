import {
    Request
    , Response
    , NextFunction
} from 'express';
import { ResourceError, ServerInternalError } from '../errors';
import { RouteNotFoundError } from './server.errors';

export const serverErrorHandler = (
    err: ResourceError
    , req: Request
    , res: Response<ResourceError>

    /**
     * To recognize the error handler middleware,
     * Express counts the one with 4 arguments. Even
     * though we do not need the 'next' argument, we need
     * to keep it here.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    , next: NextFunction
): Response<ResourceError> => {
    const internalError = new ServerInternalError( undefined, err );
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
    } else {
        return next( req );
    }
};
