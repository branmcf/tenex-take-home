/* ----------------- Imports --------------------- */
/* eslint-disable @typescript-eslint/naming-convention */
import { WorkflowToolUsageDatasetCase } from './datasets.types';

export const workflowToolUsageDataset: WorkflowToolUsageDatasetCase[] = [
    {
        name: 'use tools for research steps only'
        , story: 'A workflow needs web research before summarization.'
        , inputs: {
            userMessage: 'Find current sources on the topic and summarize them.'
            , steps: [
                {
                    id: 'step_1'
                    , name: 'Research sources'
                    , instruction: 'Find the latest sources about the topic.'
                    , dependsOn: []
                }
                , {
                    id: 'step_2'
                    , name: 'Summarize'
                    , instruction: 'Summarize the sources into a short brief.'
                    , dependsOn: [ 'step_1' ]
                }
            ]
            , availableTools: [
                {
                    id: 'web_search'
                    , name: 'web_search'
                    , version: '1.0.0'
                }
            ]
        }
        , mocks: { llmText: '{"steps":[{"stepId":"step_1","useTools":true,"tools":[{"id":"web_search","version":"1.0.0"}]},{"stepId":"step_2","useTools":false,"tools":[]}]}' }
        , expected: {
            isSuccess: true
            , isError: false
            , stepsCount: 2
            , useTools: true
            , toolId: 'web_search'
            , expectedUsageByStepId: {
                step_1: true
                , step_2: false
            }
        }
    }
    , {
        name: 'returns error when JSON is invalid'
        , story: 'The model responds with plain text instead of structured tool usage JSON.'
        , inputs: {
            userMessage: 'Classify which steps need tools for a lightweight workflow.'
            , steps: [
                {
                    id: 'step_1'
                    , name: 'Draft overview'
                    , instruction: 'Write a short overview from the input.'
                    , dependsOn: []
                }
            ]
            , availableTools: [
                {
                    id: 'web_search'
                    , name: 'web_search'
                    , version: '1.0.0'
                }
            ]
        }
        , mocks: { llmText: 'not json' }
        , expected: {
            isSuccess: false
            , isError: true
            , stepsCount: 0
            , useTools: null
            , toolId: null
            , expectedUsageByStepId: {}
        }
    }
];
