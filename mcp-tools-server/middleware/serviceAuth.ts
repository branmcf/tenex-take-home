import {
    Request
    , Response
    , NextFunction
} from 'express';
import { UnauthorizedError } from '../errors';
import { Log } from '../utils';

const normalizeServiceKey = ( value: string ) => {
    const trimmed = value.trim();
    if ( trimmed.startsWith( '"' ) && trimmed.endsWith( '"' ) ) {
        return trimmed.slice( 1, -1 );
    }
    if ( trimmed.startsWith( '\'' ) && trimmed.endsWith( '\'' ) ) {
        return trimmed.slice( 1, -1 );
    }
    return trimmed;
};

export const serviceAuth = ( req: Request, res: Response, next: NextFunction ) => {
    const serviceKey = normalizeServiceKey( process.env.MCP_TOOLS_API_KEY ?? '' );
    const headerKey = normalizeServiceKey( req.header( 'x-service-key' ) ?? '' );

    if ( serviceKey && headerKey !== serviceKey ) {
        Log.warn( '[MCP] Unauthorized request', {
            hasHeaderKey: Boolean( headerKey )
            , hasServiceKey: Boolean( serviceKey )
        } );
        const error = new UnauthorizedError();
        return res.status( error.statusCode ).json( error );
    }

    return next();
};
