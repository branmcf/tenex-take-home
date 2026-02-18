/* ----------------- Imports --------------------- */
import { WorkflowRunnerToolsSuccessDatasetCase } from './datasets.types';

export const workflowRunnerToolsSuccessDataset: WorkflowRunnerToolsSuccessDatasetCase[] = [
    {
        name: 'executes MCP tool and returns final output'
        , story: 'A workflow step invokes a tool and returns an LLM response.'
        , inputs: {
            workflowId: 'workflow-1'
            , chatId: 'chat-1'
            , triggerMessageId: 'message-1'
            , userMessage: 'Run it.'
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
                                        , name: 'Lookup'
                                        , instruction: 'Use the tool.'
                                        , dependsOn: []
                                        , tools: [ { id: 'tool_1', name: 'Example Tool', version: '1.0.0' } ]
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
            , cachedTools: [
                {
                    id: 'db-tool-id'
                    , externalId: 'tool_1'
                    , name: 'Example Tool'
                    , description: 'Example tool'
                    , schema: {
                        type: 'object'
                        , properties: { query: { type: 'string' } }
                        , required: [ 'query' ]
                    }
                    , version: '1.0.0'
                }
            ]
            , toolOutput: { result: 'ok' }
        }
        , expected: {
            success: true
            , content: 'Final output'
            , toolCall: {
                id: 'tool_1'
                , version: '1.0.0'
                , input: { query: 'hello' }
            }
        }
    }
];
