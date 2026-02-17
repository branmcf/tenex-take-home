/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import { searchWeb } from '../lib/exa';
import { generateSources } from '../lib/llm/llm.rag';
import { success, error } from '../types';
import { ragGenerateSourcesDataset } from './datasets/rag-generate-sources.dataset';

/* ----------------- Mocks ----------------------- */
jest.mock( '../lib/exa', () => ( { searchWeb: jest.fn() } ) );

/* ----------------- Tests ----------------------- */

ls.describe( 'RAG source generation', () => {

    beforeEach( () => {
        jest.clearAllMocks();
    } );

    ragGenerateSourcesDataset.forEach( example => {
        ls.test(
            example.name
            , async () => {

                if ( example.mocks?.searchResult?.type === 'success' ) {
                    searchWeb.mockResolvedValueOnce( success( example.mocks.searchResult.data ) );
                }

                if ( example.mocks?.searchResult?.type === 'error' ) {
                    searchWeb.mockResolvedValueOnce( error( { message: example.mocks.searchResult.message } ) );
                }

                const result = await generateSources( example.inputs.query );

                const outputs = {
                    sources: result
                    , searchCalled: searchWeb.mock.calls.length > 0
                };

                await logAndAssertExactMatch( ls, outputs, example.expected );

            }
        );
    } );

} );
