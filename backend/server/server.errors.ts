import {
    Request, Response, NextFunction
} from 'express';
import { ResourceError } from '../errors';

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

export class RouteNotFoundError extends ResourceError {
    public constructor () {
        const message = 'This route does not exist.';
        const statusCode = 404;
        const code = 'ROUTE_NOT_FOUND';
        super( {
            message
            , code
            , statusCode
        } );
    }
}

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
        const internalError = new RouteNotFoundError();
        return res
            .status( internalError.statusCode )
            .json( internalError );
    } else {
        return next( req );
    }
};