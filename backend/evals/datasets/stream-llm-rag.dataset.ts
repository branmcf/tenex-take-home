/* ----------------- Imports --------------------- */
import { StreamLlmRagDatasetCase } from './datasets.types';

export const streamLlmRagDataset: StreamLlmRagDatasetCase[] = [
    {
        name: 'augments streaming prompt with web search sources'
        , story: 'A user requests the latest updates, so streaming includes sources.'
        , inputs: {
            modelId: 'gpt-4o'
            , prompt: 'What is the latest update on project milestones?'
            , useRAG: true
        }
        , mocks: {
            sources: [
                {
                    url: 'https://example.com'
                    , title: 'Example'
                    , text: 'Example summary'
                }
            ]
            , streamTextResult: { textStream: 'mock-stream' }
        }
        , expected: {
            sourcesCount: 1
            , promptIncludesWebSearchResults: true
            , promptIncludesExample: true
            , promptIncludesUrl: true
            , promptIncludesSummary: true
            , searchCalled: true
        }
    }
    , {
        name: 'does not call search when useRAG is false'
        , story: 'A quick reply should stream without retrieval.'
        , inputs: {
            modelId: 'gpt-4o'
            , prompt: 'Hello, just checking in.'
            , useRAG: false
        }
        , mocks: {
            streamTextResult: { textStream: 'mock-stream' }
        }
        , expected: {
            sourcesCount: 0
            , promptIncludesWebSearchResults: false
            , promptIncludesExample: false
            , promptIncludesUrl: false
            , promptIncludesSummary: false
            , searchCalled: false
        }
    }
];
