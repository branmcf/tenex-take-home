import {
    NextFunction, Request, Response
} from 'express';
import { ServerInternalError } from '../../errors';
import { Log } from '../../utils';


export const requestHandlerErrorWrapper = <
    Q extends Request
    , S extends Response
    , N extends NextFunction
>
( fn: ( req: Q, res: S, next: N ) => Promise<S> ) => (
    req: Q
    , res: S
    , next: N
): void => {
    fn( req, res, next )
        .catch( ( error: Error ) => {
            Log.error( error );

            const serverInternalError = new ServerInternalError(
                undefined
                , { message: error.message }
            );

            return res
                .status( serverInternalError.statusCode )
                .json( serverInternalError );
        } );
};