import express from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    serverErrorHandler
    , clientErrorHandler
} from './server.helper';
import { Log } from '../utils';
import {
    requestLogger
    , rateLimiter
    , RATE_LIMIT_PRESETS
} from '../middleware';
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

expressApp.use( cors( {
    origin: [
        'http://localhost:3000'
        , 'http://localhost:3026'
        , 'https://app-hardwire.branmcf.com'
    ]
    , credentials: true
} ) );

expressApp.use( express.static( path.join( __dirname, '../public' ) ) );

requestLogger( expressApp );

expressApp.get( '/email-verified', ( req, res ) => {
    res.sendFile( path.join( __dirname, '../public/email-verified.html' ) );
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
 *
 * Rate limits:
 * - Auth endpoints: 10 requests/minute (stricter to prevent brute force)
 * - Session polling: 100 requests/minute (standard)
 * - All other API: 100 requests/minute (standard)
 */

/*
 * Helper function to check if rate limiting should be bypassed
 * Used for development/testing environments where rate limits would interfere
 */
const skipRateLimit = () => process.env.SKIP_RATE_LIMIT === 'true';

/*
 * Helper function to identify session polling endpoints
 * These endpoints are called frequently by the frontend to check auth status
 * and need different rate limiting rules than other auth endpoints
 */
const isSessionPath = ( req: { path: string } ) =>
    req.path === '/get-session' || req.path === '/mcp/get-session';

// Convert the better-auth handler to work with Express middleware
const authHandler = toNodeHandler( auth );

/*
 * Auth routes with dual rate limiting strategy:
 * 1. Stricter limits for auth operations (login, signup, etc.) to prevent brute force
 * 2. Standard limits for session polling to allow frequent status checks
 * The skip logic ensures session endpoints get standard limits, others get auth limits
 */
expressApp.use(
    '/api/auth'

    // First rate limiter: strict auth limits, but skip for session endpoints
    , rateLimiter( {
        ...RATE_LIMIT_PRESETS.auth
        , skip: ( req ) => skipRateLimit() || isSessionPath( req )
    } )

    // Second rate limiter: standard limits, but only for session endpoints
    , rateLimiter( {
        ...RATE_LIMIT_PRESETS.standard
        , skip: ( req ) => skipRateLimit() || !isSessionPath( req )
    } )

    // Logging middleware to track auth route usage for debugging
    , ( req, res ) => {
        Log.info( '[AUTH] Matched route:', { method: req.method, url: req.url, originalUrl: req.originalUrl } );
        authHandler( req, res );
    }
);

/*
 * All other API routes get standard rate limiting
 * This includes workflow operations, chat endpoints, etc.
 * JSON parsing is applied here since auth routes handle their own parsing
 */
expressApp.use(
    '/api'
    , rateLimiter( {
        ...RATE_LIMIT_PRESETS.standard
        , skip: skipRateLimit
    } )
    , express.json()
    , apiRouter
);

/**
 * Error handling
 */
expressApp.use( clientErrorHandler );
expressApp.use( serverErrorHandler );
