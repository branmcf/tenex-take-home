export interface LLMSource {
    url: string;
    title: string;
    description?: string;
}

export interface ChatHistoryMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface LLMGenerateParams {
    modelId: string;
    prompt: string;
    maxTokens?: number;
    temperature?: number;
    useRAG?: boolean;  // whether to use web search for context (default: true)
    conversationHistory?: ChatHistoryMessage[];  // previous messages for context
}

export interface LLMGenerateResult {
    content: string;
    sources: LLMSource[];
    searchPerformed: boolean;  // whether web search was actually used
    usage?: {
        inputTokens: number;
        outputTokens: number;
        totalTokens: number;
    };
}

export interface LLMStreamParams {
    modelId: string;
    prompt: string;
    maxTokens?: number;
    temperature?: number;
    useRAG?: boolean;  // whether to use web search for context (default: true)
    conversationHistory?: ChatHistoryMessage[];  // previous messages for context
}

export interface SearchClassificationResult {
    needsSearch: boolean;
    reason: string;
}
