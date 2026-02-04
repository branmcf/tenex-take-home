// external dependencies
import express from 'express';

// internal dependencies
import { livenessRouter } from './liveness';
import { modelsRouter } from './models';
import { chatsRouter } from './chats';
import { usersRouter } from './users';
import { workflowsRouter } from './workflows';
import { toolsRouter } from './tools';
import { sessionValidator } from '../middleware';

// create an express router
export const apiRouter = express.Router();

// use the routers
apiRouter.use( '/liveness', livenessRouter );
apiRouter.use( '/models', sessionValidator, modelsRouter );
apiRouter.use( '/users', sessionValidator, usersRouter );
apiRouter.use( '/chats', sessionValidator, chatsRouter );
apiRouter.use( '/workflows', sessionValidator, workflowsRouter );
apiRouter.use( '/tools', sessionValidator, toolsRouter );
