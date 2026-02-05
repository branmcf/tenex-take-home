/* ----------------- Imports --------------------- */
import { ProvidersRoutingDatasetCase } from './datasets.types';

export const providersRoutingDataset: ProvidersRoutingDatasetCase[] = [
    {
        name: 'routes gpt-* to OpenAI'
        , story: 'A workflow run requests a GPT model for a general assistant response.'
        , inputs: {
            modelId: 'gpt-4o'
        }
        , expected: {
            provider: 'openai'
            , routedModel: 'gpt-4o'
        }
    }
    , {
        name: 'routes claude-* to Anthropic'
        , story: 'A power user prefers Claude for long-form summarization.'
        , inputs: {
            modelId: 'claude-3-sonnet'
        }
        , expected: {
            provider: 'anthropic'
            , routedModel: 'claude-3-sonnet'
        }
    }
    , {
        name: 'routes gemini-* to Google'
        , story: 'A team experiment selects a Gemini model for multimodal support.'
        , inputs: {
            modelId: 'gemini-1.5-pro'
        }
        , expected: {
            provider: 'google'
            , routedModel: 'gemini-1.5-pro'
        }
    }
    , {
        name: 'falls back to gpt-4o when model id is unknown'
        , story: 'A misconfigured client sends an unrecognized model id.'
        , inputs: {
            modelId: 'unknown-model'
        }
        , expected: {
            provider: 'openai'
            , routedModel: 'gpt-4o'
        }
    }
];
