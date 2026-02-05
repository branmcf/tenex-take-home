/* ----------------- Imports --------------------- */
import { WorkflowDagValidatorDatasetCase } from './datasets.types';

export const workflowDagValidatorDataset: WorkflowDagValidatorDatasetCase[] = [
    {
        name: 'passes for a valid dag with tools'
        , story: 'A workflow includes a valid tool that exists in the system.'
        , inputs: {
            dag: {
                steps: [
                    {
                        id: 'step_1'
                        , name: 'Start'
                        , instruction: 'Do the thing.'
                        , tools: [ { id: 'tool_a', name: 'Tool A', version: '1.0.0' } ]
                        , dependsOn: []
                    }
                ]
            }
            , validTools: [ { id: 'tool_a', name: 'Tool A', version: '1.0.0' } ]
        }
        , expected: {
            isSuccess: true
            , isError: false
        }
    }
    , {
        name: 'fails when duplicate step ids exist'
        , story: 'A workflow is invalid because two steps share the same id.'
        , inputs: {
            dag: {
                steps: [
                    { id: 'step_1', name: 'A', instruction: 'A', dependsOn: [] }
                    , { id: 'step_1', name: 'B', instruction: 'B', dependsOn: [] }
                ]
            }
        }
        , expected: {
            isSuccess: false
            , isError: true
        }
    }
    , {
        name: 'fails when dependency is missing'
        , story: 'A step depends on another step that is not present.'
        , inputs: {
            dag: {
                steps: [
                    { id: 'step_1', name: 'A', instruction: 'A', dependsOn: [ 'step_2' ] }
                ]
            }
        }
        , expected: {
            isSuccess: false
            , isError: true
        }
    }
    , {
        name: 'fails when a cycle exists'
        , story: 'Cyclic dependencies are not allowed in the DAG.'
        , inputs: {
            dag: {
                steps: [
                    { id: 'step_1', name: 'A', instruction: 'A', dependsOn: [ 'step_2' ] }
                    , { id: 'step_2', name: 'B', instruction: 'B', dependsOn: [ 'step_1' ] }
                ]
            }
        }
        , expected: {
            isSuccess: false
            , isError: true
        }
    }
    , {
        name: 'fails when tool references are not in the valid tool list'
        , story: 'A step references a tool that the system does not know about.'
        , inputs: {
            dag: {
                steps: [
                    {
                        id: 'step_1'
                        , name: 'A'
                        , instruction: 'A'
                        , tools: [ { id: 'tool_missing', name: 'Missing', version: '1.0.0' } ]
                        , dependsOn: []
                    }
                ]
            }
            , validTools: [ { id: 'tool_a', name: 'Tool A', version: '1.0.0' } ]
        }
        , expected: {
            isSuccess: false
            , isError: true
        }
    }
];
