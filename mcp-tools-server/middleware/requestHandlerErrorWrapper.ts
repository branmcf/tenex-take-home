import {
    NextFunction
    , Request
    , Response
} from 'express';
import { ServerInternalError } from '../errors';
import { Log } from '../utils';

export const requestHandlerErrorWrapper = <Q extends Request, S extends Response, N extends NextFunction>(
    fn: ( req: Q, res: S, next: N ) => Promise<S>
) => (
    req: Q
    , res: S
    , next: N
): void => {
    fn( req, res, next )
        .catch( ( err: Error ) => {
            Log.error( err );

            const serverInternalError = new ServerInternalError();

            return res
                .status( serverInternalError.statusCode )
                .json( serverInternalError );
        } );
};
