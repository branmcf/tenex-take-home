// external dependencies
import express from 'express';

// internal dependencies
import { livenessRouter } from './liveness';

// create an express router
export const apiRouter = express.Router();

// use the routers
apiRouter.use( '/liveness', livenessRouter );