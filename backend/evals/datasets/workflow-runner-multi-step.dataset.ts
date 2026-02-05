/* ----------------- Imports --------------------- */
import { WorkflowRunnerMultiStepDatasetCase } from './datasets.types';

export const workflowRunnerMultiStepDataset: WorkflowRunnerMultiStepDatasetCase[] = [
    {
        name: 'passes upstream output to dependent steps'
        , story: 'Step two should receive the output of step one in its prompt.'
        , inputs: {
            workflowId: 'workflow-1'
            , chatId: 'chat-1'
            , triggerMessageId: 'message-1'
            , userMessage: 'Run the workflow.'
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
                                        , name: 'First'
                                        , instruction: 'Produce output.'
                                        , dependsOn: []
                                        , tools: []
                                    }
                                    , {
                                        id: 'step_2'
                                        , name: 'Second'
                                        , instruction: 'Use the output.'
                                        , dependsOn: [ 'step_1' ]
                                        , tools: []
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
            , llmTexts: [ 'Output from step 1', 'Final output' ]
        }
        , expected: {
            success: true
            , content: 'Final output'
            , promptIncludesStepLabel: true
            , promptIncludesOutput: true
        }
    }
];
