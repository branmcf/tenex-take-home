/* ----------------- Types ----------------------- */

export type DatasetCase<TInputs, TExpected, TMocks = undefined> = {
    name: string;
    story: string;
    inputs: TInputs;
    expected: TExpected;
    mocks?: TMocks;
};

export type ChatTitleDatasetCase = DatasetCase<
    {
        chatId: string;
        userMessage: string;
        modelId?: string;
    }
    , {
        success: boolean;
        title: string | null;
        wasUpdated: boolean;
    }
    , {
        action: 'llm' | 'fallback';
        llmContent?: string;
    }
>;

export type GoldenWorkflowDatasetCase = DatasetCase<
    {
        userMessage: string;
        workflowName: string;
        workflowDescription: string | null;
        dag: {
            steps: Array<{
                id: string;
                name: string;
                instruction: string;
                tools: Array<{ id: string; name: string; version: string }>;
                dependsOn: string[];
            }>;
        };
        availableTools: Array<{ id: string; name: string; version: string }>;
        conversationContext: string | null;
        toolUsageSteps: Array<{
            id: string;
            name: string;
            instruction: string;
            dependsOn: string[];
        }>;
    }
    , {
        expectedIntent: 'modify_workflow' | 'ask_clarifying' | 'answer_only';
        expectsClarification: boolean;
        expectedUsageByStepId: Record<string, boolean>;
    }
>;

export type LlmErrorHandlingDatasetCase = DatasetCase<
    {
        modelId: string;
        prompt: string;
        useRAG: boolean;
    }
    , {
        isError: boolean;
        code: string;
        statusCode: number;
    }
    , {
        errorMessage: string;
    }
>;

export type ProvidersRoutingDatasetCase = DatasetCase<
    {
        modelId: string;
    }
    , {
        provider: string;
        routedModel: string;
    }
>;

export type RagAugmentationDatasetCase = DatasetCase<
    {
        modelId: string;
        prompt: string;
        useRAG: boolean;
    }
    , {
        success: boolean;
        sourcesCount: number;
        firstSourceUrl: string | null;
        promptIncludesWebSearchResults: boolean;
        promptIncludesExampleA: boolean;
        promptIncludesUrl: boolean;
        promptIncludesSummary: boolean;
        totalTokens: number;
        searchCalled: boolean;
    }
    , {
        sources?: Array<{ url: string; title: string; text: string }>;
        llmResponse: {
            text: string;
            usage: { inputTokens: number; outputTokens: number };
        };
    }
>;

export type RagGenerateSourcesDatasetCase = DatasetCase<
    {
        query: string;
    }
    , {
        sources: Array<{ url: string; title: string; description: string }>;
        searchCalled: boolean;
    }
    , {
        searchResult?:
            | { type: 'success'; data: Array<{ url: string; title: string; text: string }> }
            | { type: 'error'; message: string };
    }
>;

export type RagHeuristicsDatasetCase = DatasetCase<
    {
        query: string;
        reason: string;
    }
    , {
        needsWebSearch: boolean;
    }
>;

export type StreamLlmRagDatasetCase = DatasetCase<
    {
        modelId: string;
        prompt: string;
        useRAG: boolean;
    }
    , {
        sourcesCount: number;
        promptIncludesWebSearchResults: boolean;
        promptIncludesExample: boolean;
        promptIncludesUrl: boolean;
        promptIncludesSummary: boolean;
        searchCalled: boolean;
    }
    , {
        sources?: Array<{ url: string; title: string; text: string }>;
        streamTextResult: { textStream: string };
    }
>;

export type WorkflowChatHistorySummarizationDatasetCase = DatasetCase<
    {
        userMessage: string;
        historyMessages: Array<{ role: 'user' | 'assistant'; content: string }>;
        recentMessageContent: string;
        excludedMessageContent: string;
    }
    , {
        success: boolean;
        summaryCalled: number;
        summaryPromptContainsInstruction: boolean;
        contextIncludesSummaryHeader: boolean;
        contextIncludesSummaryText: boolean;
        contextIncludesRecentMessages: boolean;
        contextIncludesRecentMessage: boolean;
        contextExcludesOlderMessage: boolean;
    }
    , {
        summaryText: string;
    }
>;

export type WorkflowChatResponseNoToolCallsDatasetCase = DatasetCase<
    {
        userMessage: string;
        modelId: string;
    }
    , {
        success: boolean;
        content: string;
        hasProposedChanges: boolean;
    }
    , {
        intent: {
            intent: 'modify_workflow' | 'ask_clarifying' | 'answer_only';
            assistantMessage: string;
            clarificationQuestion: string | null;
        };
        toolCalls: {
            assistantMessage: string;
            toolCalls: Array<{
                name: string;
                args: Record<string, unknown>;
            }>;
        };
    }
>;

export type WorkflowChatResponseDatasetCase = DatasetCase<
    {
        userMessage: string;
        modelId: string;
    }
    , {
        success: boolean;
        content: string;
        hasProposedChanges: boolean;
        previewStepsCount: number;
        contentIncludesReview: boolean;
    }
    , {
        intent: {
            intent: 'modify_workflow' | 'ask_clarifying' | 'answer_only';
            assistantMessage: string;
            clarificationQuestion: string | null;
        };
        toolCalls?: {
            assistantMessage: string;
            toolCalls: Array<{
                name: string;
                args: Record<string, unknown>;
            }>;
        };
        appliedDag?: {
            steps: Array<{
                id: string;
                name: string;
                instruction: string;
                tools: Array<unknown>;
                dependsOn: string[];
            }>;
        };
        proposal?: {
            id: string;
            createdAt: string;
        };
    }
>;

export type WorkflowDagModifierDatasetCase = DatasetCase<
    {
        dag: {
            steps: Array<{
                id: string;
                name: string;
                instruction: string;
                tools: Array<{ id: string; name: string; version: string }>;
                dependsOn: string[];
            }>;
        };
        toolCalls: Array<{ name: string; args: Record<string, unknown> }>;
        availableTools: Array<{ id: string; name: string; version: string }>;
        generatedId: string;
    }
    , {
        isSuccess: boolean;
        isError: boolean;
        addedDependsOn?: string[] | null;
        toolIds?: string[] | null;
        hasDeletedStep?: boolean;
        dependsOn?: string[] | null;
    }
>;

export type WorkflowDagSorterDatasetCase = DatasetCase<
    {
        steps: Array<{ id: string; name: string; instruction: string; dependsOn: string[] }>;
    }
    , {
        sortedIds: string[];
    }
>;

export type WorkflowDagValidatorDatasetCase = DatasetCase<
    {
        dag: {
            steps: Array<{
                id: string;
                name: string;
                instruction: string;
                tools?: Array<{ id: string; name: string; version: string }>;
                dependsOn: string[];
            }>;
        };
        validTools?: Array<{ id: string; name: string; version: string }>;
    }
    , {
        isSuccess: boolean;
        isError: boolean;
    }
>;

export type WorkflowIntentDatasetCase = DatasetCase<
    {
        userMessage: string;
        modelId?: string;
    }
    , {
        isSuccess: boolean;
        intent: 'modify_workflow' | 'ask_clarifying' | 'answer_only';
        assistantMessage: string | null;
        clarificationQuestion: string | null;
        clarificationQuestionContains: boolean;
        expectsClarification: boolean;
    }
    , {
        llmText: string;
    }
>;

export type WorkflowMetadataDatasetCase = DatasetCase<
    {
        userMessage: string;
        modelId: string;
    }
    , {
        isSuccess: boolean;
        name: string;
        description: string;
        descriptionContains: boolean;
    }
    , {
        llmContent: string;
    }
>;

export type WorkflowProposalApplyDatasetCase = DatasetCase<
    {
        workflowId: string;
        proposalId: string;
    }
    , {
        statusCode: number;
        errorCode: string;
    }
    , {
        proposalResult:
            | { type: 'expired' }
            | {
                type: 'success';
                proposal: {
                    id: string;
                    workflowId: string;
                    baseVersionId: string;
                    proposedDag: { steps: Array<unknown> };
                    userMessage: string;
                    modelId: string;
                };
                latestVersionId: string;
            };
    }
>;

export type WorkflowProposalsExpirationDatasetCase = DatasetCase<
    {
        proposals?: Array<{
            id: string;
            workflowId: string;
            baseVersionId: string;
            userMessage: string;
            modelId: string;
            toolCalls: unknown[];
            proposedDag: { steps: Array<unknown> };
            createdAt: string;
            expiresAt: string;
            status?: 'pending';
        }>;
        proposalById?: {
            id: string;
            workflowId: string;
            baseVersionId: string;
            userMessage: string;
            modelId: string;
            toolCalls: unknown[];
            proposedDag: { steps: Array<unknown> };
            createdAt: string;
            expiresAt: string;
        };
    }
    , {
        isError?: boolean;
        isSuccess?: boolean;
        code?: string;
        proposalId?: string;
        expiredMarked: boolean;
    }
>;

export type WorkflowRunnerMultiStepDatasetCase = DatasetCase<
    {
        workflowId: string;
        chatId: string;
        triggerMessageId: string;
        userMessage: string;
        modelId: string;
    }
    , {
        success: boolean;
        content: string;
        promptIncludesStepLabel: boolean;
        promptIncludesOutput: boolean;
    }
    , {
        workflow: {
            id: string;
            workflowVersionsByWorkflowId: {
                nodes: Array<{
                    id: string;
                    dag: {
                        steps: Array<{
                            id: string;
                            name: string;
                            instruction: string;
                            dependsOn: string[];
                            tools: Array<unknown>;
                        }>;
                    };
                }>;
            };
        };
        llmTexts: [ string, string ];
    }
>;

export type WorkflowRunnerToolsFailureDatasetCase = DatasetCase<
    {
        workflowId: string;
        chatId: string;
        triggerMessageId: string;
        userMessage: string;
        modelId: string;
    }
    , {
        isError: boolean;
        message: string;
        toolCalled: boolean;
    }
    , {
        workflow: {
            id: string;
            workflowVersionsByWorkflowId: {
                nodes: Array<{
                    id: string;
                    dag: {
                        steps: Array<{
                            id: string;
                            name: string;
                            instruction: string;
                            dependsOn: string[];
                            tools: Array<{ id: string; name: string; version: string }>;
                        }>;
                    };
                }>;
            };
        };
        cachedTools: Array<{
            id: string;
            externalId: string;
            name: string;
            description: string;
            schema: {
                type: string;
                properties: { query: { type: string } };
                required: string[];
            };
            version: string;
        }>;
        toolError: {
            message: string;
            statusCode: number;
            code: string;
        };
    }
>;

export type WorkflowRunnerToolsSuccessDatasetCase = DatasetCase<
    {
        workflowId: string;
        chatId: string;
        triggerMessageId: string;
        userMessage: string;
        modelId: string;
    }
    , {
        success: boolean;
        content: string;
        toolCall: { id: string; version: string; input: Record<string, unknown> } | null;
    }
    , {
        workflow: {
            id: string;
            workflowVersionsByWorkflowId: {
                nodes: Array<{
                    id: string;
                    dag: {
                        steps: Array<{
                            id: string;
                            name: string;
                            instruction: string;
                            dependsOn: string[];
                            tools: Array<{ id: string; name: string; version: string }>;
                        }>;
                    };
                }>;
            };
        };
        cachedTools: Array<{
            id: string;
            externalId: string;
            name: string;
            description: string;
            schema: {
                type: string;
                properties: { query: { type: string } };
                required: string[];
            };
            version: string;
        }>;
        toolOutput: { result: string };
    }
>;

export type WorkflowRunnerDatasetCase = DatasetCase<
    {
        workflowId: string;
        chatId: string;
        triggerMessageId: string;
        userMessage: string;
        modelId: string;
    }
    , {
        success: boolean;
        content: string;
        generateCalled: boolean;
    }
    , {
        workflow: {
            id: string;
            workflowVersionsByWorkflowId: {
                nodes: Array<{
                    id: string;
                    dag: {
                        steps: Array<{
                            id: string;
                            name: string;
                            instruction: string;
                            dependsOn: string[];
                            tools: Array<unknown>;
                        }>;
                    };
                }>;
            };
        };
        llmText: string;
    }
>;

export type WorkflowStepPlanDatasetCase = DatasetCase<
    {
        userMessage: string;
        modelId: string;
        workflowName: string;
        workflowDescription: string | null;
    }
    , {
        isSuccess: boolean;
        isError: boolean;
        stepsCount: number;
        firstStepName: string | null;
    }
    , {
        llmText: string;
    }
>;

export type WorkflowSystemPromptDatasetCase = DatasetCase<
    {
        promptType: 'intent' | 'tool_usage';
        input: Record<string, unknown>;
    }
    , Record<string, boolean>
>;

export type WorkflowToolCallsDatasetCase = DatasetCase<
    {
        userMessage: string;
        modelId: string;
        workflowName: string;
        workflowDescription: string | null;
    }
    , {
        isSuccess: boolean;
        toolCallsCount: number;
        toolName: string | null;
        toolArgName: string | null;
    }
    , {
        llmText: string;
        toolCalls: Array<{ toolName: string; input: Record<string, unknown> }>;
    }
>;

export type WorkflowToolUsageDatasetCase = DatasetCase<
    {
        userMessage: string;
        steps: Array<{
            id: string;
            name: string;
            instruction: string;
            dependsOn: string[];
        }>;
        availableTools: Array<{
            id: string;
            name: string;
            version: string;
        }>;
    }
    , {
        isSuccess: boolean;
        isError: boolean;
        stepsCount: number;
        useTools: boolean | null;
        toolId: string | null;
        expectedUsageByStepId: Record<string, boolean>;
    }
    , {
        llmText: string;
    }
>;

export type WorkflowToolsSchemaDatasetCase = DatasetCase<
    {
        toolName: 'add_step' | 'update_step' | 'delete_step' | 'reorder_steps';
    }
    , {
        hasRequiredName?: boolean;
        hasRequiredInstruction?: boolean;
        additionalProperties: boolean;
        toolRequiresId?: boolean;
        toolRequiresVersion?: boolean;
        requiresStepId?: boolean;
        requiresNewDependsOn?: boolean;
    }
>;
