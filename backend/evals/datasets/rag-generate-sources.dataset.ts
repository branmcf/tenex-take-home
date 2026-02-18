/* ----------------- Imports --------------------- */
import { RagGenerateSourcesDatasetCase } from './datasets.types';

export const ragGenerateSourcesDataset: RagGenerateSourcesDatasetCase[] = [
    {
        name: 'returns empty sources when search fails'
        , story: 'The search provider fails, so the system falls back with no sources.'
        , inputs: { query: 'What are the latest AI governance updates today?' }
        , mocks: { searchResult: { type: 'error', message: 'search failed' } }
        , expected: {
            sources: []
            , searchCalled: true
        }
    }
    , {
        name: 'maps search results into LLM sources'
        , story: 'Relevant web results are transformed into source objects.'
        , inputs: { query: 'Latest AI trends in enterprise software' }
        , mocks: {
            searchResult: {
                type: 'success'
                , data: [
                    {
                        url: 'https://example.com'
                        , title: 'Example'
                        , text: 'Example summary'
                    }
                ]
            }
        }
        , expected: {
            sources: [
                {
                    url: 'https://example.com'
                    , title: 'Example'
                    , description: 'Example summary'
                }
            ]
            , searchCalled: true
        }
    }
];
