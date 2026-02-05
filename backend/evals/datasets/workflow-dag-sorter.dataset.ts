/* ----------------- Imports --------------------- */
import { WorkflowDagSorterDatasetCase } from './datasets.types';

export const workflowDagSorterDataset: WorkflowDagSorterDatasetCase[] = [
    {
        name: 'keeps stable order for steps with no dependencies'
        , story: 'Independent steps keep their original order when possible.'
        , inputs: {
            steps: [
                { id: 'step_b', name: 'B', instruction: 'B', dependsOn: [] }
                , { id: 'step_a', name: 'A', instruction: 'A', dependsOn: [] }
                , { id: 'step_c', name: 'C', instruction: 'C', dependsOn: [ 'step_a' ] }
            ]
        }
        , expected: {
            sortedIds: [ 'step_b', 'step_a', 'step_c' ]
        }
    }
    , {
        name: 'falls back to original order when a cycle prevents full sorting'
        , story: 'A cyclic dependency cannot be fully sorted, so the original order is preserved.'
        , inputs: {
            steps: [
                { id: 'step_1', name: 'A', instruction: 'A', dependsOn: [ 'step_2' ] }
                , { id: 'step_2', name: 'B', instruction: 'B', dependsOn: [ 'step_1' ] }
            ]
        }
        , expected: {
            sortedIds: [ 'step_1', 'step_2' ]
        }
    }
];
