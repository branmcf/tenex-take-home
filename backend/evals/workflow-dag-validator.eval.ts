/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import { validateWorkflowDag } from '../utils/workflowDags';
import { workflowDagValidatorDataset } from './datasets/workflow-dag-validator.dataset';

/* ----------------- Tests ----------------------- */

ls.describe( 'Workflow DAG validation', () => {

    workflowDagValidatorDataset.forEach( example => {
        ls.test(
            example.name
            , async () => {

                const result = validateWorkflowDag( {
                    dag: example.inputs.dag
                    , validTools: example.inputs.validTools
                } );

                const outputs = {
                    isSuccess: result.isSuccess()
                    , isError: result.isError()
                };

                await logAndAssertExactMatch( ls, outputs, example.expected );

            }
        );
    } );

} );
