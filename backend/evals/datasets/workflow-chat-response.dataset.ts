/* ----------------- Imports --------------------- */
import { WorkflowChatResponseDatasetCase } from './datasets.types';

export const workflowChatResponseDataset: WorkflowChatResponseDatasetCase[] = [
    {
        name: 'returns clarification content when intent is ask_clarifying'
        , story: 'A vague request triggers a clarifying question.'
        , inputs: {
            userMessage: 'Can you update this workflow?'
            , modelId: 'gpt-4o'
        }
        , mocks: {
            intent: {
                intent: 'ask_clarifying'
                , assistantMessage: ''
                , clarificationQuestion: 'What should I change?'
            }
        }
        , expected: {
            success: true
            , content: 'What should I change?'
            , hasProposedChanges: false
            , previewStepsCount: 0
            , contentIncludesReview: false
        }
    }
    , {
        name: 'returns assistant content when intent is answer_only'
        , story: 'A user asks for an explanation rather than a workflow change.'
        , inputs: {
            userMessage: 'What is a DAG in simple terms?'
            , modelId: 'gpt-4o'
        }
        , mocks: {
            intent: {
                intent: 'answer_only'
                , assistantMessage: 'Here is an answer.'
                , clarificationQuestion: null
            }
        }
        , expected: {
            success: true
            , content: 'Here is an answer.'
            , hasProposedChanges: false
            , previewStepsCount: 0
            , contentIncludesReview: false
        }
    }
    , {
        name: 'creates a proposal when intent is modify_workflow'
        , story: 'A concrete edit request results in a proposed change set.'
        , inputs: {
            userMessage: 'Add a summary step after the research step.'
            , modelId: 'gpt-4o'
        }
        , mocks: {
            intent: {
                intent: 'modify_workflow'
                , assistantMessage: 'Adding a step.'
                , clarificationQuestion: null
            }
            , toolCalls: {
                assistantMessage: 'Added a step.'
                , toolCalls: [
                    {
                        name: 'add_step'
                        , args: {
                            tempId: 'temp_1'
                            , name: 'Summarize'
                            , instruction: 'Summarize the input.'
                        }
                    }
                ]
            }
            , appliedDag: {
                steps: [
                    {
                        id: 'step_1'
                        , name: 'Summarize'
                        , instruction: 'Summarize the input.'
                        , tools: []
                        , dependsOn: []
                    }
                ]
            }
            , proposal: {
                id: 'proposal-1'
                , createdAt: '2026-01-01T00:00:00.000Z'
            }
        }
        , expected: {
            success: true
            , content: 'Added a step.\n\nReview the proposed changes below and click Apply Changes or Reject.'
            , hasProposedChanges: true
            , previewStepsCount: 1
            , contentIncludesReview: true
        }
    }
];
