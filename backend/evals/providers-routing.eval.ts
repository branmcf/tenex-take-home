/* ----------------- Imports --------------------- */
import ls from './evals.ls';
import { logAndAssertExactMatch } from './evals.helper';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { getModelProvider } from '../lib/llm/llm.providers';
import { providersRoutingDataset } from './datasets/providers-routing.dataset';

/* ----------------- Mocks ----------------------- */
jest.mock( '@ai-sdk/openai', () => ( { openai: jest.fn( modelId => ( { provider: 'openai', modelId } ) ) } ) );

jest.mock( '@ai-sdk/anthropic', () => ( { anthropic: jest.fn( modelId => ( { provider: 'anthropic', modelId } ) ) } ) );

jest.mock( '@ai-sdk/google', () => ( { google: jest.fn( modelId => ( { provider: 'google', modelId } ) ) } ) );

/* ----------------- Tests ----------------------- */

ls.describe( 'Model provider routing', () => {

    beforeEach( () => {
        jest.clearAllMocks();
    } );

    providersRoutingDataset.forEach( example => {
        ls.test(
            example.name
            , async () => {

                const model = getModelProvider( example.inputs.modelId );

                let routedModel: string | null = null;

                if ( example.expected.provider === 'openai' ) {
                    routedModel = openai.mock.calls[ 0 ]?.[ 0 ] ?? null;
                }

                if ( example.expected.provider === 'anthropic' ) {
                    routedModel = anthropic.mock.calls[ 0 ]?.[ 0 ] ?? null;
                }

                if ( example.expected.provider === 'google' ) {
                    routedModel = google.mock.calls[ 0 ]?.[ 0 ] ?? null;
                }

                const outputs = {
                    provider: model.provider
                    , routedModel
                };

                await logAndAssertExactMatch( ls, outputs, example.expected );

            }
        );
    } );

} );
