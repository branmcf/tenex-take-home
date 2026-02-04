export interface WorkflowProposalRecord {
    id: string;
    workflowId: string;
    baseVersionId: string | null;
    userMessage: string;
    modelId?: string | null;
    toolCalls: unknown;
    proposedDag: unknown;
    createdAt: string;
    expiresAt: string;
}

export interface CreateWorkflowProposalParams {
    workflowId: string;
    baseVersionId: string | null;
    userMessage: string;
    modelId?: string | null;
    toolCalls: unknown;
    proposedDag: unknown;
    expiresAt: string;
}
