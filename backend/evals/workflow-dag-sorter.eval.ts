/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import { sortWorkflowDagSteps } from '../utils/workflowDags';
import { workflowDagSorterDataset } from './datasets/workflow-dag-sorter.dataset';

/* ----------------- Tests ----------------------- */

ls.describe( 'Workflow DAG sorter', () => {

    workflowDagSorterDataset.forEach( example => {
        ls.test(
            example.name
            , async () => {

                const sorted = sortWorkflowDagSteps( example.inputs.steps );

                const outputs = { sortedIds: sorted.map( step => step.id ) };

                await logAndAssertExactMatch( ls, outputs, example.expected );

            }
        );
    } );

} );
