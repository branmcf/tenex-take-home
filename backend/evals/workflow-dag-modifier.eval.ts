/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import { applyToolCallsToDag } from '../utils/workflowDags';
import { workflowDagModifierDataset } from './datasets/workflow-dag-modifier.dataset';

/* ----------------- Tests ----------------------- */

ls.describe( 'Workflow DAG modifier', () => {

    workflowDagModifierDataset.forEach( example => {
        ls.test(
            example.name
            , async () => {

                const result = applyToolCallsToDag( {
                    dag: example.inputs.dag
                    , toolCalls: example.inputs.toolCalls
                    , availableTools: example.inputs.availableTools
                    , idGenerator: () => example.inputs.generatedId
                } );

                const addedStep = result.isSuccess()
                    ? result.value.steps.find( step => step.id === example.inputs.generatedId )
                    : null;

                const step3 = result.isSuccess()
                    ? result.value.steps.find( step => step.id === 'step_3' )
                    : null;

                const updatedStep = result.isSuccess()
                    ? result.value.steps.find( step => step.id === 'step_1' )
                    : null;

                const outputs = {
                    isSuccess: result.isSuccess()
                    , isError: result.isError()
                    , addedDependsOn: addedStep?.dependsOn ?? null
                    , toolIds: updatedStep?.tools?.map( tool => tool.id ) ?? null
                    , hasDeletedStep: Boolean( result.isSuccess() && result.value.steps.find( step => step.id === 'step_2' ) )
                    , dependsOn: step3?.dependsOn ?? null
                };

                const filteredOutputs = Object.keys( example.expected ).reduce<Record<string, unknown>>( ( acc, key ) => {
                    acc[ key ] = outputs[ key as keyof typeof outputs ];
                    return acc;
                }, {} );

                await logAndAssertExactMatch( ls, filteredOutputs, example.expected );

            }
        );
    } );

} );
