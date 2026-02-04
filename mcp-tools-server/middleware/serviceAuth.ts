import {
    Request
    , Response
    , NextFunction
} from 'express';
import { UnauthorizedError } from '../errors';

export const serviceAuth = ( req: Request, res: Response, next: NextFunction ) => {
    const serviceKey = process.env.MCP_TOOLS_API_KEY ?? '';
    const headerKey = req.header( 'x-service-key' ) ?? '';

    if ( serviceKey && headerKey !== serviceKey ) {
        const error = new UnauthorizedError();
        return res.status( error.statusCode ).json( error );
    }

    return next();
};
