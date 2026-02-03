import express from 'express';
import { requestHandlerErrorWrapper } from '../../middleware';
import { getModelsHandler } from './models.ctrl';

// create an express router
export const modelsRouter = express.Router();

// define the routes of the express router
modelsRouter
    .get(
        '/'
        , requestHandlerErrorWrapper( getModelsHandler )
    );
