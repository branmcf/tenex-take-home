import { Express } from 'express';
import { Log } from '../utils';

export const requestLogger = ( app: Express ) => {
    app.use( ( req, _res, next ) => {
        Log.info( `[MCP] ${ req.method } ${ req.originalUrl }` );
        next();
    } );
};
