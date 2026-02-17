/* ----------------- Imports --------------------- */
/* eslint-disable @typescript-eslint/naming-convention */
import { GoldenWorkflowDatasetCase } from './datasets.types';

export const goldenWorkflowDataset: GoldenWorkflowDatasetCase[] = [
    {
        name: 'incident response workflow update'
        , story: 'An SRE wants to add a stakeholder notification step to the incident workflow.'
        , inputs: {
            userMessage: 'Add a final step that emails the incident summary to stakeholders.'
            , workflowName: 'Incident Response'
            , workflowDescription: 'Triage incidents, collect logs, and publish summaries.'
            , dag: {
                steps: [
                    {
                        id: 'step_1'
                        , name: 'Collect logs'
                        , instruction: 'Gather logs from the last 60 minutes.'
                        , tools: [ { id: 'web_search', name: 'Web Search', version: '1.0.0' } ]
                        , dependsOn: []
                    }
                    , {
                        id: 'step_2'
                        , name: 'Write summary'
                        , instruction: 'Summarize findings for the incident report.'
                        , tools: []
                        , dependsOn: [ 'step_1' ]
                    }
                ]
            }
            , availableTools: [ { id: 'web_search', name: 'web_search', version: '1.0.0' } ]
            , conversationContext: null
            , toolUsageSteps: [
                {
                    id: 'step_1'
                    , name: 'Collect logs'
                    , instruction: 'Gather logs from the last 60 minutes.'
                    , dependsOn: []
                }
                , {
                    id: 'step_2'
                    , name: 'Write summary'
                    , instruction: 'Summarize findings for the incident report.'
                    , dependsOn: [ 'step_1' ]
                }
            ]
        }
        , expected: {
            expectedIntent: 'modify_workflow'
            , expectsClarification: false
            , expectedUsageByStepId: {
                step_1: true
                , step_2: false
            }
        }
    }
    , {
        name: 'pipeline summary explanation'
        , story: 'A user asks what the workflow does rather than requesting edits.'
        , inputs: {
            userMessage: 'Can you explain what this workflow does?'
            , workflowName: 'Pipeline Summary'
            , workflowDescription: 'Summarizes CRM pipeline stages and risks.'
            , dag: {
                steps: [
                    {
                        id: 'step_1'
                        , name: 'Fetch pipeline'
                        , instruction: 'Pull pipeline data from CRM.'
                        , tools: []
                        , dependsOn: []
                    }
                ]
            }
            , availableTools: []
            , conversationContext: null
            , toolUsageSteps: [
                {
                    id: 'step_1'
                    , name: 'Fetch pipeline'
                    , instruction: 'Pull pipeline data from CRM.'
                    , dependsOn: []
                }
            ]
        }
        , expected: {
            expectedIntent: 'answer_only'
            , expectsClarification: false
            , expectedUsageByStepId: { step_1: false }
        }
    }
    , {
        name: 'ambiguous request requires clarification'
        , story: 'The user says make it better without specifying changes.'
        , inputs: {
            userMessage: 'Make this workflow better.'
            , workflowName: 'Weekly Report'
            , workflowDescription: 'Generates a weekly executive report.'
            , dag: {
                steps: [
                    {
                        id: 'step_1'
                        , name: 'Compile metrics'
                        , instruction: 'Collect KPI metrics.'
                        , tools: []
                        , dependsOn: []
                    }
                ]
            }
            , availableTools: []
            , conversationContext: null
            , toolUsageSteps: [
                {
                    id: 'step_1'
                    , name: 'Compile metrics'
                    , instruction: 'Collect KPI metrics.'
                    , dependsOn: []
                }
            ]
        }
        , expected: {
            expectedIntent: 'ask_clarifying'
            , expectsClarification: true
            , expectedUsageByStepId: { step_1: false }
        }
    }
    , {
        name: 'customer feedback workflow enhancement'
        , story: 'A product manager wants a new step to categorize feedback themes.'
        , inputs: {
            userMessage: 'Add a step that clusters feedback by theme before summarizing.'
            , workflowName: 'Customer Feedback'
            , workflowDescription: 'Collects and summarizes customer feedback.'
            , dag: {
                steps: [
                    {
                        id: 'step_1'
                        , name: 'Collect feedback'
                        , instruction: 'Pull feedback from support tickets.'
                        , tools: []
                        , dependsOn: []
                    }
                    , {
                        id: 'step_2'
                        , name: 'Summarize'
                        , instruction: 'Summarize feedback into insights.'
                        , tools: []
                        , dependsOn: [ 'step_1' ]
                    }
                ]
            }
            , availableTools: []
            , conversationContext: null
            , toolUsageSteps: [
                {
                    id: 'step_1'
                    , name: 'Collect feedback'
                    , instruction: 'Pull feedback from support tickets.'
                    , dependsOn: []
                }
                , {
                    id: 'step_2'
                    , name: 'Summarize'
                    , instruction: 'Summarize feedback into insights.'
                    , dependsOn: [ 'step_1' ]
                }
            ]
        }
        , expected: {
            expectedIntent: 'modify_workflow'
            , expectsClarification: false
            , expectedUsageByStepId: {
                step_1: false
                , step_2: false
            }
        }
    }
    , {
        name: 'competitive analysis workflow update'
        , story: 'A strategy lead wants research to include external sources.'
        , inputs: {
            userMessage: 'Add a step to pull recent competitor announcements from the web.'
            , workflowName: 'Competitive Analysis'
            , workflowDescription: 'Tracks competitor positioning and updates.'
            , dag: {
                steps: [
                    {
                        id: 'step_1'
                        , name: 'Collect internal notes'
                        , instruction: 'Gather internal notes from the strategy team.'
                        , tools: []
                        , dependsOn: []
                    }
                    , {
                        id: 'step_2'
                        , name: 'Summarize'
                        , instruction: 'Summarize findings and risks.'
                        , tools: []
                        , dependsOn: [ 'step_1' ]
                    }
                ]
            }
            , availableTools: [ { id: 'web_search', name: 'web_search', version: '1.0.0' } ]
            , conversationContext: null
            , toolUsageSteps: [
                {
                    id: 'step_1'
                    , name: 'Collect internal notes'
                    , instruction: 'Gather internal notes from the strategy team.'
                    , dependsOn: []
                }
                , {
                    id: 'step_2'
                    , name: 'Summarize'
                    , instruction: 'Summarize findings and risks.'
                    , dependsOn: [ 'step_1' ]
                }
            ]
        }
        , expected: {
            expectedIntent: 'modify_workflow'
            , expectsClarification: false
            , expectedUsageByStepId: {
                step_1: false
                , step_2: false
            }
        }
    }
];
