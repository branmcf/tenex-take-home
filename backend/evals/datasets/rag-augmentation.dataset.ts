/* ----------------- Imports --------------------- */
import { RagAugmentationDatasetCase } from './datasets.types';

export const ragAugmentationDataset: RagAugmentationDatasetCase[] = [
    {
        name: 'injects web search results into the prompt when sources are available'
        , story: 'A user asks for recent sources, so the system prepends web results to the prompt.'
        , inputs: {
            modelId: 'gpt-4o'
            , prompt: 'What do the latest sources say about retention trends?'
            , useRAG: true
        }
        , mocks: {
            sources: [
                {
                    url: 'https://example.com/a'
                    , title: 'Example A'
                    , text: 'Summary A'
                }
                , {
                    url: 'https://example.com/b'
                    , title: 'Example B'
                    , text: 'Summary B'
                }
            ]
            , llmResponse: {
                text: 'Here is the response.'
                , usage: {
                    inputTokens: 10
                    , outputTokens: 20
                }
            }
        }
        , expected: {
            success: true
            , sourcesCount: 2
            , firstSourceUrl: 'https://example.com/a'
            , promptIncludesWebSearchResults: true
            , promptIncludesExampleA: true
            , promptIncludesUrl: true
            , promptIncludesSummary: true
            , totalTokens: 30
            , searchCalled: true
        }
    }
    , {
        name: 'skips web search when useRAG is false'
        , story: 'A lightweight response should skip retrieval augmentation.'
        , inputs: {
            modelId: 'gpt-4o'
            , prompt: 'Give me a short status update template.'
            , useRAG: false
        }
        , mocks: {
            llmResponse: {
                text: 'Response without RAG.'
                , usage: { inputTokens: 5, outputTokens: 7 }
            }
        }
        , expected: {
            success: true
            , sourcesCount: 0
            , firstSourceUrl: null
            , promptIncludesWebSearchResults: false
            , promptIncludesExampleA: false
            , promptIncludesUrl: false
            , promptIncludesSummary: false
            , totalTokens: 12
            , searchCalled: false
        }
    }
];
