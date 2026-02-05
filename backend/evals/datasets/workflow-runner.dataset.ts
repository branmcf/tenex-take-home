/* ----------------- Imports --------------------- */
import { WorkflowRunnerDatasetCase } from './datasets.types';

export const workflowRunnerDataset: WorkflowRunnerDatasetCase[] = [
    {
        name: 'runs a single-step workflow and returns the final output'
        , story: 'A workflow with one step should execute and return the LLM output.'
        , inputs: {
            workflowId: 'workflow-1'
            , chatId: 'chat-1'
            , triggerMessageId: 'message-1'
            , userMessage: 'Summarize this report.'
            , modelId: 'gpt-4o'
        }
        , mocks: {
            workflow: {
                id: 'workflow-1'
                , workflowVersionsByWorkflowId: {
                    nodes: [
                        {
                            id: 'version-1'
                            , dag: {
                                steps: [
                                    {
                                        id: 'step_1'
                                        , name: 'Summarize'
                                        , instruction: 'Summarize the input.'
                                        , dependsOn: []
                                        , tools: []
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
            , llmText: 'Final output.'
        }
        , expected: {
            success: true
            , content: 'Final output.'
            , generateCalled: true
        }
    }
];
