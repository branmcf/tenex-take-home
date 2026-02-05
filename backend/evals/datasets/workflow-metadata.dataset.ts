/* ----------------- Imports --------------------- */
import { WorkflowMetadataDatasetCase } from './datasets.types';

export const workflowMetadataDataset: WorkflowMetadataDatasetCase[] = [
    {
        name: 'parses valid JSON metadata from the LLM'
        , story: 'A workflow author requests a name and description.'
        , inputs: {
            userMessage: 'Summarize the quarterly report for leadership.'
            , modelId: 'gpt-4o'
        }
        , mocks: {
            llmContent: '{ "name": "Quick Summary", "description": "Summarizes the report." }'
        }
        , expected: {
            isSuccess: true
            , name: 'Quick Summary'
            , description: 'Summarizes the report.'
            , descriptionContains: true
        }
    }
    , {
        name: 'falls back to a truncated user message when JSON is invalid'
        , story: 'When the model returns invalid JSON, the helper uses a fallback name.'
        , inputs: {
            userMessage: 'Create a workflow that collects notes and produces a concise summary.'
            , modelId: 'gpt-4o'
        }
        , mocks: {
            llmContent: 'not json output'
        }
        , expected: {
            isSuccess: true
            , name: 'Create a workflow that collects notes'
            , description: 'Create a workflow that collects notes and produces a concise summary.'
            , descriptionContains: true
        }
    }
];
