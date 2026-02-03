export interface LLMSource {
    url: string;
    title: string;
    description?: string;
}

export interface LLMGenerateParams {
    modelId: string;
    prompt: string;
    maxTokens?: number;
    temperature?: number;
    useRAG?: boolean;  // whether to use web search for context (default: true)
}

export interface LLMGenerateResult {
    content: string;
    sources: LLMSource[];
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
}
