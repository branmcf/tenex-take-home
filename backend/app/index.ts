// external dependencies
import express from 'express';

// internal dependencies
import { livenessRouter } from './liveness';
import { modelsRouter } from './models';
import { messagesRouter } from './messages';
import { chatsRouter } from './chats';
import { workflowsRouter } from './workflows';
import { workflowChatMessagesRouter } from './workflowChatMessages';

// create an express router
export const apiRouter = express.Router();

// use the routers
apiRouter.use( '/liveness', livenessRouter );
apiRouter.use( '/models', modelsRouter );
apiRouter.use( '/chats/:chatId/messages', messagesRouter );
apiRouter.use( '/workflows/:workflowId/messages', workflowChatMessagesRouter );
apiRouter.use( '/', chatsRouter );
apiRouter.use( '/', workflowsRouter );