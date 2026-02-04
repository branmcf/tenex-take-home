import express from 'express';
import cors from 'cors';
import http from 'http';
import {
    clientErrorHandler
    , serverErrorHandler
} from './server.helper';
import { requestLogger, serviceAuth } from '../middleware';
import { apiRouter } from '../app';

export const expressApp = express();

export const app = http.createServer( expressApp );

// middleware
expressApp.use( cors( {
    origin: '*'
    , credentials: true
} ) );

requestLogger( expressApp );

expressApp.use( express.json() );

// routes
expressApp.use( '/', serviceAuth, apiRouter );

// error handling
expressApp.use( clientErrorHandler );
expressApp.use( serverErrorHandler );
