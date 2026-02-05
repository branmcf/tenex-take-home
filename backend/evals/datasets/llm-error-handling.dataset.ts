/* ----------------- Imports --------------------- */
import { LlmErrorHandlingDatasetCase } from './datasets.types';

export const llmErrorHandlingDataset: LlmErrorHandlingDatasetCase[] = [
    {
        name: 'returns LLM_REQUEST_FAILED when the model throws'
        , story: 'A user asks for a short summary but the model fails to respond.'
        , inputs: {
            modelId: 'gpt-4o'
            , prompt: 'Summarize the meeting notes into three bullets.'
            , useRAG: false
        }
        , mocks: {
            errorMessage: 'boom'
        }
        , expected: {
            isError: true
            , code: 'LLM_REQUEST_FAILED'
            , statusCode: 500
        }
    }
];
