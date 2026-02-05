/* ----------------- Imports --------------------- */
import { ChatTitleDatasetCase } from './datasets.types';

export const chatTitleDataset: ChatTitleDatasetCase[] = [
    {
        name: 'strips quotes and updates title from LLM output'
        , story: 'A user asks for a concise quarterly summary title.'
        , inputs: {
            chatId: 'chat-1'
            , userMessage: 'Summarize the Q4 revenue and margin report for the exec team.'
            , modelId: 'gpt-4o'
        }
        , mocks: {
            action: 'llm'
            , llmContent: '"Quarterly Metrics"'
        }
        , expected: {
            success: true
            , title: 'Quarterly Metrics'
            , wasUpdated: true
        }
    }
    , {
        name: 'truncates long titles to 100 characters'
        , story: 'The model returns a title that is too long, so it must be trimmed.'
        , inputs: {
            chatId: 'chat-2'
            , userMessage: 'Create a detailed title for the customer onboarding analysis discussion.'
            , modelId: 'gpt-4o'
        }
        , mocks: {
            action: 'llm'
            , llmContent: 'A'.repeat( 140 )
        }
        , expected: {
            success: true
            , title: 'A'.repeat( 100 )
            , wasUpdated: true
        }
    }
    , {
        name: 'generates a deterministic fallback title when LLM is unavailable'
        , story: 'If the LLM is unavailable, fall back to a short version of the user message.'
        , inputs: {
            chatId: 'chat-3'
            , userMessage: 'Draft a brief sales pipeline update.'
        }
        , mocks: {
            action: 'fallback'
        }
        , expected: {
            success: true
            , title: 'Draft a brief sales pipeline update.'
            , wasUpdated: true
        }
    }
];
