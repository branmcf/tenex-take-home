/**
 * Test-specific server setup
 *
 * This module provides a minimal Express server for integration testing
 * that avoids ESM-specific features (import.meta.url) which don't work in Jest.
 */
import express from 'express';
import cors from 'cors';
import {
    serverErrorHandler
    , clientErrorHandler
} from '../server/server.helper';
import { apiRouter } from '../app';

/**
 * Express app for testing
 */
export const createTestApp = (): express.Express => {
    const testApp = express();

    // CORS
    testApp.use( cors( {
        origin: [
            'http://localhost:3000'
            , 'http://localhost:3026'
        ]
        , credentials: true
    } ) );

    // API routes
    testApp.use(
        '/api'
        , express.json()
        , apiRouter
    );

    // Error handling
    testApp.use( clientErrorHandler );
    testApp.use( serverErrorHandler );

    return testApp;
};

export const testApp = createTestApp();
