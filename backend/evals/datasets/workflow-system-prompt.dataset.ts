/* ----------------- Imports --------------------- */
import { WorkflowSystemPromptDatasetCase } from './datasets.types';

export const workflowSystemPromptDataset: WorkflowSystemPromptDatasetCase[] = [
    {
        name: 'includes workflow metadata, steps, tools, and conversation history'
        , story: 'A prompt should include core workflow context for intent classification.'
        , inputs: {
            promptType: 'intent'
            , input: {
                userMessage: 'Add a summary step.'
                , workflowName: 'Demo Workflow'
                , workflowDescription: 'Handles demo tasks.'
                , dag: {
                    steps: [
                        {
                            id: 'step_1'
                            , name: 'Start'
                            , instruction: 'Do start.'
                            , tools: [ { id: 'web_search', name: 'Web Search', version: '1.0.0' } ]
                            , dependsOn: []
                        }
                    ]
                }
                , availableTools: [ { id: 'web_search', name: 'Web Search', version: '1.0.0' } ]
                , conversationContext: 'User: hello\nAssistant: hi'
            }
        }
        , expected: {
            includesWorkflowName: true
            , includesWorkflowDescription: true
            , includesStart: true
            , includesToolId: true
            , includesConversationHistory: true
            , includesUserRequest: true
            , includesJsonInstruction: true
        }
    }
    , {
        name: 'includes tool usage decision rules and candidate steps'
        , story: 'Tool usage prompts should show decision rules and step details.'
        , inputs: {
            promptType: 'tool_usage'
            , input: {
                userMessage: 'Use tools when needed.'
                , workflowName: 'Tool Usage'
                , workflowDescription: null
                , steps: [
                    {
                        id: 'step_1'
                        , name: 'Research'
                        , instruction: 'Find sources.'
                        , dependsOn: []
                    }
                ]
                , availableTools: [ { id: 'web_search', name: 'Web Search', version: '1.0.0' } ]
                , conversationContext: null
            }
        }
        , expected: {
            includesDecisionRules: true
            , includesCandidateSteps: true
            , includesResearch: true
            , includesToolId: true
        }
    }
];
