/* ----------------- Imports --------------------- */
import { WorkflowDagModifierDatasetCase } from './datasets.types';

export const workflowDagModifierDataset: WorkflowDagModifierDatasetCase[] = [
    {
        name: 'adds a step at the end when position is end'
        , story: 'A workflow author adds a final summary step.'
        , inputs: {
            dag: {
                steps: [
                    {
                        id: 'step_1'
                        , name: 'First'
                        , instruction: 'Do first.'
                        , tools: []
                        , dependsOn: []
                    }
                    , {
                        id: 'step_2'
                        , name: 'Second'
                        , instruction: 'Do second.'
                        , tools: []
                        , dependsOn: [ 'step_1' ]
                    }
                ]
            }
            , toolCalls: [
                {
                    name: 'add_step'
                    , args: {
                        name: 'Third'
                        , instruction: 'Do third.'
                        , position: 'end'
                    }
                }
            ]
            , availableTools: []
            , generatedId: 'step_3'
        }
        , expected: {
            isSuccess: true
            , isError: false
            , addedDependsOn: [ 'step_2' ]
        }
    }
    , {
        name: 'updates tools by adding and removing'
        , story: 'A maintainer swaps an outdated tool for a new one.'
        , inputs: {
            dag: {
                steps: [
                    {
                        id: 'step_1'
                        , name: 'First'
                        , instruction: 'Do first.'
                        , tools: [ { id: 'tool_a', name: 'Tool A', version: '1.0.0' } ]
                        , dependsOn: []
                    }
                    , {
                        id: 'step_2'
                        , name: 'Second'
                        , instruction: 'Do second.'
                        , tools: []
                        , dependsOn: [ 'step_1' ]
                    }
                ]
            }
            , toolCalls: [
                {
                    name: 'update_step'
                    , args: {
                        stepId: 'step_1'
                        , addTools: [ { id: 'tool_b', version: '1.0.0' } ]
                        , removeTools: [ { id: 'tool_a', version: '1.0.0' } ]
                    }
                }
            ]
            , availableTools: [
                { id: 'tool_a', name: 'Tool A', version: '1.0.0' }
                , { id: 'tool_b', name: 'Tool B', version: '1.0.0' }
            ]
            , generatedId: 'ignored'
        }
        , expected: {
            isSuccess: true
            , isError: false
            , toolIds: [ 'tool_b' ]
        }
    }
    , {
        name: 'rewires dependencies automatically when deleting a step'
        , story: 'An author deletes a middle step and expects dependencies to reconnect.'
        , inputs: {
            dag: {
                steps: [
                    {
                        id: 'step_1'
                        , name: 'First'
                        , instruction: 'Do first.'
                        , tools: []
                        , dependsOn: []
                    }
                    , {
                        id: 'step_2'
                        , name: 'Second'
                        , instruction: 'Do second.'
                        , tools: []
                        , dependsOn: [ 'step_1' ]
                    }
                ]
            }
            , toolCalls: [
                {
                    name: 'delete_step'
                    , args: { stepId: 'step_2' }
                }
            ]
            , availableTools: []
            , generatedId: 'ignored'
        }
        , expected: {
            isSuccess: true
            , isError: false
            , hasDeletedStep: false
        }
    }
    , {
        name: 'rewires dependencies manually when specified'
        , story: 'A user deletes a step but specifies which node should inherit dependencies.'
        , inputs: {
            dag: {
                steps: [
                    {
                        id: 'step_1'
                        , name: 'First'
                        , instruction: 'First'
                        , tools: []
                        , dependsOn: []
                    }
                    , {
                        id: 'step_2'
                        , name: 'Second'
                        , instruction: 'Second'
                        , tools: []
                        , dependsOn: [ 'step_1' ]
                    }
                    , {
                        id: 'step_3'
                        , name: 'Third'
                        , instruction: 'Third'
                        , tools: []
                        , dependsOn: [ 'step_2' ]
                    }
                ]
            }
            , toolCalls: [
                {
                    name: 'delete_step'
                    , args: {
                        stepId: 'step_2'
                        , rewireStrategy: 'manual'
                        , rewireToStepId: 'step_1'
                    }
                }
            ]
            , availableTools: []
            , generatedId: 'ignored'
        }
        , expected: {
            isSuccess: true
            , isError: false
            , dependsOn: [ 'step_1' ]
        }
    }
    , {
        name: 'returns error when updating a missing step'
        , story: 'An update references a step that is not in the DAG.'
        , inputs: {
            dag: {
                steps: [
                    {
                        id: 'step_1'
                        , name: 'First'
                        , instruction: 'Do first.'
                        , tools: []
                        , dependsOn: []
                    }
                ]
            }
            , toolCalls: [
                {
                    name: 'update_step'
                    , args: {
                        stepId: 'missing'
                        , instruction: 'Update'
                    }
                }
            ]
            , availableTools: []
            , generatedId: 'ignored'
        }
        , expected: {
            isSuccess: false
            , isError: true
        }
    }
];
