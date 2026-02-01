import express from 'express';
import { requestHandlerErrorWrapper } from '../../middleware';
import { getLivenessHandler } from './liveness.ctrl';

// create an express router
export const livenessRouter = express.Router();

// define the routes of the express router
livenessRouter
    .get(
        '/'
        , requestHandlerErrorWrapper( getLivenessHandler )
    );