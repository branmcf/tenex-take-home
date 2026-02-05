/* ----------------- Imports --------------------- */
import { WorkflowChatResponseNoToolCallsDatasetCase } from './datasets.types';

export const workflowChatResponseNoToolCallsDataset: WorkflowChatResponseNoToolCallsDatasetCase[] = [
    {
        name: 'returns assistant content without proposed changes'
        , story: 'The assistant decides no changes are needed and returns a response.'
        , inputs: {
            userMessage: 'Can you tweak this workflow to be more efficient?'
            , modelId: 'gpt-4o'
        }
        , mocks: {
            intent: {
                intent: 'modify_workflow'
                , assistantMessage: 'No changes needed.'
                , clarificationQuestion: null
            }
            , toolCalls: {
                assistantMessage: 'No changes needed.'
                , toolCalls: []
            }
        }
        , expected: {
            success: true
            , content: 'No changes needed.'
            , hasProposedChanges: false
        }
    }
];
