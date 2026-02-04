import * as MessagesSchemas from '../../app/messages/messages.validation';
import * as ChatsSchemas from '../../app/chats/chats.validation';
import * as WorkflowsSchemas from '../../app/workflows/workflows.validation';
import * as WorkflowChatMessagesSchemas from '../../app/workflowChatMessages/workflowChatMessages.validation';
import * as ToolsSchemas from '../../app/tools/tools.validation';

export const SCHEMAS = {
    ...MessagesSchemas
    , ...ChatsSchemas
    , ...WorkflowsSchemas
    , ...WorkflowChatMessagesSchemas
    , ...ToolsSchemas
};
