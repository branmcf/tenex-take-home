/* ----------------- Imports --------------------- */
import { WorkflowIntentDatasetCase } from './datasets.types';

export const workflowIntentDataset: WorkflowIntentDatasetCase[] = [
    {
        name: 'modify workflow when the request is specific'
        , story: 'A product manager asks for a concrete change to an existing workflow.'
        , inputs: {
            userMessage: 'Please add a step that summarizes the weekly KPI report for leadership.'
            , modelId: 'gpt-4o'
        }
        , mocks: { llmText: '{ "intent": "modify_workflow", "assistantMessage": "Adding a step.", "clarificationQuestion": null }' }
        , expected: {
            isSuccess: true
            , intent: 'modify_workflow'
            , assistantMessage: 'Adding a step.'
            , clarificationQuestion: null
            , clarificationQuestionContains: false
            , expectsClarification: false
        }
    }
    , {
        name: 'answer only when the request is informational'
        , story: 'A user asks for an explanation instead of workflow changes.'
        , inputs: {
            userMessage: 'What is a DAG and why is it useful in workflows?'
            , modelId: 'gpt-4o'
        }
        , mocks: { llmText: '```json\n{ "intent": "answer_only", "assistantMessage": "Here is an answer.", "clarificationQuestion": null }\n```' }
        , expected: {
            isSuccess: true
            , intent: 'answer_only'
            , assistantMessage: 'Here is an answer.'
            , clarificationQuestion: null
            , clarificationQuestionContains: false
            , expectsClarification: false
        }
    }
    , {
        name: 'ask clarifying when JSON is malformed but intent hints at edits'
        , story: 'A vague request results in a malformed JSON response that still indicates edits.'
        , inputs: {
            userMessage: 'Make this workflow better.'
            , modelId: 'gpt-4o'
        }
        , mocks: { llmText: '{ "intent": 123, "assistantMessage": "Update" ' }
        , expected: {
            isSuccess: true
            , intent: 'ask_clarifying'
            , assistantMessage: 'I can update the workflow. What should I change?'
            , clarificationQuestion: 'What should I change in this workflow?'
            , clarificationQuestionContains: true
            , expectsClarification: true
        }
    }
    , {
        name: 'treats plain text as answer only'
        , story: 'A direct response comes back without any JSON wrapping.'
        , inputs: {
            userMessage: 'Does this workflow handle retries automatically?'
            , modelId: 'gpt-4o'
        }
        , mocks: { llmText: 'Sure - here is the response without workflow edits.' }
        , expected: {
            isSuccess: true
            , intent: 'answer_only'
            , assistantMessage: 'Sure - here is the response without workflow edits.'
            , clarificationQuestion: null
            , clarificationQuestionContains: false
            , expectsClarification: false
        }
    }
];
