import express from 'express';
import { toolsRouter } from './v0/tools';

export const apiRouter = express.Router();

apiRouter.use( '/', toolsRouter );
