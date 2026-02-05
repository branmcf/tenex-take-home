import * as MessagesSchemas from '../../app/messages/messages.validation';
import * as ChatsSchemas from '../../app/chats/chats.validation';
import * as WorkflowsSchemas from '../../app/workflows/workflows.validation';
import * as WorkflowChatMessagesSchemas from '../../app/workflowChatMessages/workflowChatMessages.validation';
import * as ToolsSchemas from '../../app/tools/tools.validation';
import * as WorkflowRunsSchemas from '../../app/workflowRuns/workflowRuns.validation';
import * as UserModelPreferencesSchemas from '../../app/users/userModelPreferences/userModelPreferences.validation';

export const SCHEMAS = {
    ...MessagesSchemas
    , ...ChatsSchemas
    , ...WorkflowsSchemas
    , ...WorkflowChatMessagesSchemas
    , ...ToolsSchemas
    , ...WorkflowRunsSchemas
    , ...UserModelPreferencesSchemas
};
