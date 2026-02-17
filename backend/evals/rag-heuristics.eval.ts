/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import { needsWebSearch } from '../lib/llm/llm.rag';
import { ragHeuristicsDataset } from './datasets/rag-heuristics.dataset';

/* ----------------- Tests ----------------------- */

ls.describe( 'RAG heuristics (needsWebSearch)', () => {

    ragHeuristicsDataset.forEach( example => {
        ls.test(
            `returns ${ example.expected.needsWebSearch } for "${ example.inputs.query }" (${ example.inputs.reason })`
            , async () => {

                const result = needsWebSearch( example.inputs.query );

                const outputs = { needsWebSearch: result };

                await logAndAssertExactMatch( ls, outputs, example.expected );

            }
        );
    } );

} );
