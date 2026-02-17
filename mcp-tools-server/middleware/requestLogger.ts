import type { Express, Request } from 'express';
import { Log } from '../utils';

const buildMcpMeta = ( req: Request ) => {
    const method = req?.body?.method;
    const params = req?.body?.params ?? {};

    if ( !method ) {
        return {};
    }

    if ( method === 'runTool' ) {
        return {
            mcpMethod: method
            , toolId: params.id
            , toolVersion: params.version
            , input: params.input
        };
    }

    if ( method === 'searchTools' ) {
        return {
            mcpMethod: method
            , query: params.query
            , limit: params.limit
        };
    }

    if ( method === 'listTools' ) {
        return {
            mcpMethod: method
            , cursor: params.cursor
            , limit: params.limit
        };
    }

    if ( method === 'getTool' ) {
        return {
            mcpMethod: method
            , toolId: params.id
            , toolVersion: params.version
        };
    }

    return { mcpMethod: method };
};

export const requestLogger = ( app: Express ) => {
    app.use( ( req, _res, next ) => {
        const startedAt = Date.now();
        const meta = buildMcpMeta( req );

        _res.on( 'finish', () => {
            const durationMs = Date.now() - startedAt;
            Log.info( `[MCP] ${ req.method } ${ req.originalUrl } ${ _res.statusCode } ${ durationMs }ms`, meta );
        } );

        return next();
    } );
};
