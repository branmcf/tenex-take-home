import express from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    serverErrorHandler
    , clientErrorHandler
} from './server.helper';
import { requestLogger } from '../middleware';
import { auth } from '../lib/betterAuth/auth';
import { toNodeHandler } from 'better-auth/node';
import { apiRouter }  from '../app';
import { postgraphile } from 'postgraphile';

// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath( import.meta.url );
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = path.dirname( __filename );

/**
 * Express server
 */

export const expressApp = express();

export const app = http.createServer( expressApp );

/**
 * Middleware
 */

expressApp.use( cors() );

expressApp.use( express.static( path.join( __dirname, '../public' ) ) );

requestLogger( expressApp );

expressApp.get( '/', ( req, res ) => {
    res.sendFile( path.join( __dirname, 'hello' ) );
} );

// development-only GraphQL endpoint for codegen
if ( process.env.NODE_ENV !== 'production' ) {

    const graphqlMiddleware = postgraphile( process.env.DATABASE_URL!, 'public', {
        graphiql: true
        , enhanceGraphiql: true
        , dynamicJson: true
        , disableDefaultMutations: false
        , showErrorStack: true
        , graphiqlRoute: '/graphiql'
        , graphqlRoute: '/graphql'
        , extendedErrors: [
            'hint'
            , 'detail'
            , 'errcode'
        ]
    } );

    expressApp.get( '/graphql', graphqlMiddleware );
    expressApp.get( '/graphiql', graphqlMiddleware );
    expressApp.post( '/graphql', graphqlMiddleware );
    expressApp.post( '/graphiql', graphqlMiddleware );
}

/**
 * Routes
 */

expressApp.all(
    '/api/auth/*'
    , toNodeHandler( auth )
);

expressApp.use(
    '/api'
    , express.json()
    , apiRouter
);

/**
 * Error handling
 */
expressApp.use( clientErrorHandler );
expressApp.use( serverErrorHandler );