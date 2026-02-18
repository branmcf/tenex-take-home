/* ----------------- Imports --------------------- */
import { WorkflowStepPlanDatasetCase } from './datasets.types';

export const workflowStepPlanDataset: WorkflowStepPlanDatasetCase[] = [
    {
        name: 'parses valid step plan JSON'
        , story: 'The user requests a simple workflow, and the model returns structured steps.'
        , inputs: {
            userMessage: 'Create a workflow to summarize a report.'
            , modelId: 'gpt-4o'
            , workflowName: 'Summary Flow'
            , workflowDescription: null
        }
        , mocks: { llmText: '{"steps":[{"name":"Summarize","instruction":"Summarize the report."}]}' }
        , expected: {
            isSuccess: true
            , isError: false
            , stepsCount: 1
            , firstStepName: 'Summarize'
        }
    }
    , {
        name: 'returns error when JSON is invalid'
        , story: 'The model fails to return valid JSON for the step plan.'
        , inputs: {
            userMessage: 'Draft a workflow for processing invoices.'
            , modelId: 'gpt-4o'
            , workflowName: 'Invoice Flow'
            , workflowDescription: null
        }
        , mocks: { llmText: 'missing json' }
        , expected: {
            isSuccess: false
            , isError: true
            , stepsCount: 0
            , firstStepName: null
        }
    }
];
