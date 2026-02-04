export interface WorkflowToolRef {
    id: string;
    name?: string;
    version?: string;
}

export interface WorkflowStep {
    id: string;
    name: string;
    instruction: string;
    tools?: WorkflowToolRef[];
    dependsOn?: string[];
}

export interface WorkflowDAG {
    steps: WorkflowStep[];
}

export interface AddStepToolCall {
    name: 'add_step';
    args: {
        tempId?: string;
        name: string;
        instruction: string;
        tools?: Array<{ id: string; version: string }>;
        dependsOn?: string[];
        position?: 'start' | 'end' | 'after';
        afterStepId?: string;
    };
}

export interface UpdateStepToolCall {
    name: 'update_step';
    args: {
        stepId: string;
        name?: string;
        instruction?: string;
        tools?: Array<{ id: string; version: string }>;
        addTools?: Array<{ id: string; version: string }>;
        removeTools?: Array<{ id: string; version: string }>;
        dependsOn?: string[];
    };
}

export interface DeleteStepToolCall {
    name: 'delete_step';
    args: {
        stepId: string;
        rewireStrategy?: 'auto' | 'manual';
        rewireToStepId?: string;
    };
}

export interface ReorderStepsToolCall {
    name: 'reorder_steps';
    args: {
        stepId: string;
        newDependsOn: string[];
    };
}

export type LLMToolCall =
    | AddStepToolCall
    | UpdateStepToolCall
    | DeleteStepToolCall
    | ReorderStepsToolCall;
