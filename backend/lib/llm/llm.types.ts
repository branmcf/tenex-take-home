import type { AsyncIterableStream } from 'ai';

// basic llm source for RAG results
export interface LLMSource {
    url: string;
    title: string;
    description?: string;
}

// chat history message for conversation context
export interface ChatHistoryMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

// params for non-streaming llm generation
export interface LLMGenerateParams {
    modelId: string;
    prompt: string;
    maxTokens?: number;
    temperature?: number;
    useRAG?: boolean;
    conversationHistory?: ChatHistoryMessage[];
}

// result from non-streaming llm generation
export interface LLMGenerateResult {
    content: string;
    sources: LLMSource[];
    searchPerformed: boolean;
    usage?: {
        inputTokens: number;
        outputTokens: number;
        totalTokens: number;
    };
}

// params for streaming llm generation
export interface LLMStreamParams {
    modelId: string;
    prompt: string;
    maxTokens?: number;
    temperature?: number;
    useRAG?: boolean;
    conversationHistory?: ChatHistoryMessage[];
}

// result from streaming llm generation
export interface LLMStreamResult {
    textStream: AsyncIterableStream<string>;
    sources: LLMSource[];
    searchPerformed: boolean;
}

// result from search classification
export interface SearchClassificationResult {
    needsSearch: boolean;
    reason: string;
}

// result from workflow intent classification
export interface WorkflowIntentResult {
    intent: 'modify_workflow' | 'ask_clarifying' | 'answer_only';
    assistantMessage: string;
    clarificationQuestion: string | null;
}

// tool usage decision for a workflow step
export interface WorkflowToolUsageDecision {
    stepId: string;
    useTools: boolean;
    tools: Array<{ id: string; version: string }>;
}

// generated step plan from llm
export interface WorkflowStepPlan {
    name: string;
    instruction: string;
}
