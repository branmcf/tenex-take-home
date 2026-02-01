import {
    Express
    , NextFunction
    , Request
    , Response
} from 'express';
import { v4 as uuid } from 'uuid';
import {
    Log
    , createNamespaceAttribute
    , createNamespaceRun
    , jsonParse
    , getNamespaceAttribute
} from '../../utils';

const requestStartHandler = (
    req: Request
    , res: Response
    , next: NextFunction
) => {

    if ( !req.headers[ 'x-request-id' ] ) {
        req.headers[ 'x-request-id' ] = uuid();
    }

    createNamespaceRun(
        async () => {

            createNamespaceAttribute( 'requestId', req.headers[ 'x-request-id' ] );

            const pathfinderName = req.headers[ 'x-pathfinder-name' ] as string;

            if ( pathfinderName ) {
                createNamespaceAttribute( 'pathfinderName', pathfinderName.toLowerCase() );
            }

            if (
                !req.path.startsWith( '/api/auth' )
                && !req.path.startsWith( '/api/webhooks/stripe' )
            ) {
                const {
                    path
                    , method
                    , query
                    , body: requestBody
                } = req;

                Log.req( {
                    method
                    , path
                    , query
                    , requestBody
                } );
            }

            next();
        }
    );
};

const requestEndHandler = (
    req: Request
    , res: Response
    , next: NextFunction
) => {
    const { method, path, query } = req;

    const resWriteRef = res.write
        , resEndRef = res.end;

    const timeStart = Date.now();

    const responseBodyChunks: Buffer[] = [];

    res.write = function ( responseBodyChunk: Uint8Array, ...args: unknown[] ) {
        const contentType = res.getHeader( 'content-type' );

        if ( typeof contentType === 'string' && contentType.includes( 'json' ) ) {
            responseBodyChunks.push( Buffer.from( responseBodyChunk ) );
        }

        return ( resWriteRef as Function ).apply( res, [ responseBodyChunk, ...args ] );
    };

    ( res.end as unknown ) = function ( responseBodyChunk?: Uint8Array, ...args: unknown[] ) {
        if ( responseBodyChunk ) {
            responseBodyChunks.push( Buffer.from( responseBodyChunk ) );
        }

        const { statusCode } = res;

        const duration = Date.now() - timeStart;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const requestBody = getNamespaceAttribute( 'parsedBody' ) || ( req as any ).parsedBody || req.body;

        let responseBody: Record<string, unknown> = {};

        const jsonParseResponseBodyResult = jsonParse<Record<string, unknown>>(
            Buffer.concat( responseBodyChunks ).toString( 'utf8' )
        );

        if ( jsonParseResponseBodyResult.isSuccess() ) {
            responseBody = jsonParseResponseBodyResult.value;
        }

        res.body = responseBody;

        Log.res( {
            method
            , path
            , query
            , requestBody
            , statusCode
            , responseBody
            , duration
        } );

        return ( resEndRef as Function ).apply( res, [ responseBodyChunk, ...args ] );
    };

    return next();
};

export const requestLogger = ( expressApp: Express ): void => {
    expressApp.use( requestStartHandler );
    expressApp.use( requestEndHandler );
};