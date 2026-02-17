/* ----------------- Imports --------------------- */
import { WorkflowToolsSchemaDatasetCase } from './datasets.types';

export const workflowToolsSchemaDataset: WorkflowToolsSchemaDatasetCase[] = [
    {
        name: 'requires name and instruction for add_step'
        , story: 'The add_step tool enforces required inputs.'
        , inputs: { toolName: 'add_step' }
        , expected: {
            hasRequiredName: true
            , hasRequiredInstruction: true
            , additionalProperties: false
            , toolRequiresId: true
            , toolRequiresVersion: true
        }
    }
    , {
        name: 'requires stepId for update_step'
        , story: 'The update_step tool requires a stepId.'
        , inputs: { toolName: 'update_step' }
        , expected: {
            requiresStepId: true
            , additionalProperties: false
        }
    }
    , {
        name: 'requires stepId for delete_step'
        , story: 'The delete_step tool requires a stepId.'
        , inputs: { toolName: 'delete_step' }
        , expected: {
            requiresStepId: true
            , additionalProperties: false
        }
    }
    , {
        name: 'requires stepId and newDependsOn for reorder_steps'
        , story: 'The reorder_steps tool requires ids for reordering.'
        , inputs: { toolName: 'reorder_steps' }
        , expected: {
            requiresStepId: true
            , requiresNewDependsOn: true
            , additionalProperties: false
        }
    }
];
