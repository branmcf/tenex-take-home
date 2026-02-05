/* ----------------- Imports --------------------- */
import { WorkflowRunnerToolsFailureDatasetCase } from './datasets.types';

export const workflowRunnerToolsFailureDataset: WorkflowRunnerToolsFailureDatasetCase[] = [
    {
        name: 'returns error when MCP tool execution fails'
        , story: 'A tool call fails, so the workflow should surface an error.'
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
                                        , tools: [
                                            { id: 'tool_1', name: 'Example Tool', version: '1.0.0' }
                                        ]
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
                        , properties: {
                            query: { type: 'string' }
                        }
                        , required: [ 'query' ]
                    }
                    , version: '1.0.0'
                }
            ]
            , toolError: {
                message: 'Tool failed.'
                , statusCode: 500
                , code: 'MCP_TOOL_EXECUTION_FAILED'
            }
        }
        , expected: {
            isError: true
            , message: 'Workflow execution failed.'
            , toolCalled: true
        }
    }
];
