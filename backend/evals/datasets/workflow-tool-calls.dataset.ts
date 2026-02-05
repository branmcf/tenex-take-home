/* ----------------- Imports --------------------- */
import { WorkflowToolCallsDatasetCase } from './datasets.types';

export const workflowToolCallsDataset: WorkflowToolCallsDatasetCase[] = [
    {
        name: 'normalizes tool calls into LLMToolCall shape'
        , story: 'A user requests a step and the model returns a tool call.'
        , inputs: {
            userMessage: 'Add a step to summarize results.'
            , modelId: 'gpt-4o'
            , workflowName: 'Tool Call Flow'
            , workflowDescription: null
        }
        , mocks: {
            llmText: 'Added a step.'
            , toolCalls: [
                {
                    toolName: 'add_step'
                    , input: {
                        name: 'Summarize'
                        , instruction: 'Summarize the results.'
                    }
                }
            ]
        }
        , expected: {
            isSuccess: true
            , toolCallsCount: 1
            , toolName: 'add_step'
            , toolArgName: 'Summarize'
        }
    }
    , {
        name: 'returns an empty tool call list when none are produced'
        , story: 'The model responds without tool calls.'
        , inputs: {
            userMessage: 'No changes needed.'
            , modelId: 'gpt-4o'
            , workflowName: 'Tool Call Flow'
            , workflowDescription: null
        }
        , mocks: {
            llmText: 'No changes.'
            , toolCalls: []
        }
        , expected: {
            isSuccess: true
            , toolCallsCount: 0
            , toolName: null
            , toolArgName: null
        }
    }
];
