/**
 * Test-specific server setup
 *
 * This module provides a minimal Express server for integration testing
 * that avoids ESM-specific features which don't work in Jest.
 */
import express from 'express';
import cors from 'cors';
import {
    serverErrorHandler
    , clientErrorHandler
} from '../server/server.helper';
import { requestLogger, serviceAuth } from '../middleware';
import { apiRouter } from '../app';

/**
 * Express app for testing
 */
export const createTestApp = (): express.Express => {
    const testApp = express();

    // CORS
    testApp.use( cors( {
        origin: '*'
        , credentials: true
    } ) );

    // JSON parsing
    testApp.use( express.json() );

    // Request logging
    requestLogger( testApp );

    // API routes with service auth
    testApp.use( '/', serviceAuth, apiRouter );

    // Error handling
    testApp.use( clientErrorHandler );
    testApp.use( serverErrorHandler );

    return testApp;
};

export const testApp = createTestApp();
