// tool reference stored on steps
export interface WorkflowToolRef {
    id: string;
    name?: string;
    version?: string;
}

// single node in the workflow dag
export interface WorkflowStep {
    id: string;
    name: string;
    instruction: string;
    tools?: WorkflowToolRef[];
    dependsOn?: string[];
}

// dag wrapper used throughout the system
export interface WorkflowDAG {
    steps: WorkflowStep[];
}

// llm tool call to add a step to the dag
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

// llm tool call to update a step in the dag
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

// llm tool call to delete a step from the dag
export interface DeleteStepToolCall {
    name: 'delete_step';
    args: {
        stepId: string;
        rewireStrategy?: 'auto' | 'manual';
        rewireToStepId?: string;
    };
}

// llm tool call to change dependency order for a step
export interface ReorderStepsToolCall {
    name: 'reorder_steps';
    args: {
        stepId: string;
        newDependsOn: string[];
    };
}

// union of all workflow authoring tool calls
export type LLMToolCall =
    | AddStepToolCall
    | UpdateStepToolCall
    | DeleteStepToolCall
    | ReorderStepsToolCall;
