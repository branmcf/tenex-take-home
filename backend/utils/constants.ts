/**
 * Centralized prompts and prompt builder functions for LLM interactions.
 * All prompts used throughout the backend should be defined here.
 */

import type {
    WorkflowDAG
    , WorkflowToolRef
    , WorkflowStep
} from '../lib/workflowDags';

/**
 * Format workflow steps for display in prompts
 */
export const formatStepsForPrompt = ( dag?: WorkflowDAG ): string => {
    if ( !dag || !Array.isArray( dag.steps ) || dag.steps.length === 0 ) {
        return 'No steps yet.';
    }

    return dag.steps.map( ( step, index ) => {
        const dependsOn = step.dependsOn && step.dependsOn.length > 0
            ? `depends on: ${ step.dependsOn.join( ', ' ) }`
            : 'depends on: none';

        const tools = step.tools && step.tools.length > 0
            ? `tools: ${ step.tools.map( tool => `${ tool.name ?? tool.id } (${ tool.id }@${ tool.version ?? 'unknown' })` ).join( ', ' ) }`
            : 'tools: none';

        return `${ index + 1 }. "${ step.name }" (id: ${ step.id })\n   - instruction: ${ step.instruction }\n   - ${ dependsOn }\n   - ${ tools }`;
    } ).join( '\n' );
};

/**
 * Format workflow steps for simple display (name and instruction only)
 */
export const formatStepsSimple = ( dag?: WorkflowDAG ): string => {
    if ( !dag || !Array.isArray( dag.steps ) || dag.steps.length === 0 ) {
        return 'No steps yet.';
    }

    return dag.steps.map( ( step, index ) => {
        return `${ index + 1 }. ${ step.name } - ${ step.instruction }`;
    } ).join( '\n' );
};

/**
 * Format available tools for display in prompts
 */
export const formatToolsForPrompt = ( tools: WorkflowToolRef[] ): string => {
    if ( tools.length === 0 ) {
        return 'No tools available.';
    }

    return tools.map( tool => {
        const name = tool.name ?? tool.id;
        const version = tool.version ?? 'unknown';
        return `- ${ name } (id: ${ tool.id }, version: ${ version })`;
    } ).join( '\n' );
};

/**
 * Format candidate steps for tool usage classification
 */
export const formatCandidateStepsForPrompt = ( steps: WorkflowDAG['steps'] ): string => {
    if ( !steps || steps.length === 0 ) {
        return 'No candidate steps.';
    }

    return steps.map( ( step, index ) => {
        const dependsOn = step.dependsOn && step.dependsOn.length > 0
            ? `depends on: ${ step.dependsOn.join( ', ' ) }`
            : 'depends on: none';

        return `${ index + 1 }. "${ step.name }" (id: ${ step.id })\n   - instruction: ${ step.instruction }\n   - ${ dependsOn }`;
    } ).join( '\n' );
};

/**
 * Format conversation history for prompts
 */
export const formatConversationHistoryForPrompt = (
    messages: Array<{ role: string; content: string }>
): string => {
    return messages.map( message => {
        const label = message.role === 'user'
            ? 'User'
            : message.role === 'assistant'
                ? 'Assistant'
                : 'System';
        return `${ label }: ${ message.content }`;
    } ).join( '\n' );
};

/**
 * Parameters for building workflow intent prompts
 */
export interface WorkflowIntentPromptParams {
    userMessage: string;
    workflowName: string;
    workflowDescription: string | null;
    dag?: WorkflowDAG;
    availableTools: WorkflowToolRef[];
    conversationContext?: string | null;
}

/**
 * Build prompt for classifying workflow authoring intent
 */
export const buildWorkflowIntentPrompt = (
    params: WorkflowIntentPromptParams
): string => {

    const conversationBlock = params.conversationContext
        ? `\nConversation history:\n${ params.conversationContext }\n`
        : '';

    return `You are a workflow builder assistant for a product where workflows are deterministic, reusable procedures.
Workflows are DAGs of steps. Each step is a prompt instruction and outputs are piped to downstream steps (like n8n).
Users select a workflow in chat and submit a message; that message is the workflow input and starting context.
Your job here is to help AUTHOR workflows, not execute them or answer the user directly.

Workflow runtime model:
1) User selects a workflow in chat and submits a message. That message is the input to the workflow.
2) Steps run in dependency order. Each step can read the user input plus outputs from upstream steps.
3) Outputs are passed forward to dependent steps. No steps are skipped.
4) The final step produces the workflow's response to the user.

Current workflow name: ${ params.workflowName }
Current workflow description: ${ params.workflowDescription ?? 'none' }

Current steps:
${ formatStepsForPrompt( params.dag ) }

Available tools:
${ formatToolsForPrompt( params.availableTools ) }

${ conversationBlock }
User request:
${ params.userMessage }

Decide the intent. Output ONLY valid JSON with this exact shape:
{
  "intent": "modify_workflow" | "ask_clarifying" | "answer_only",
  "assistantMessage": string,
  "clarificationQuestion": string | null
}

Rules:
- If the user is creating or editing a workflow, choose "modify_workflow".
- If the user is asking a question unrelated to editing the workflow, choose "answer_only".
- If required details are missing, choose "ask_clarifying" and provide a single short question.
- Prefer "modify_workflow" when the request clearly implies new steps or changes.
- Use plain English for assistantMessage and clarificationQuestion.
- Never answer the user's request as if you are running the workflow.
- Output JSON on a single line and escape any newlines as \\n.
- Do not wrap the JSON in backticks or code fences.
- Do not include any extra keys or text outside the JSON.`;

};

/**
 * Parameters for building workflow tool call prompts
 */
export interface WorkflowToolCallPromptParams {
    userMessage: string;
    workflowName: string;
    workflowDescription: string | null;
    dag?: WorkflowDAG;
    availableTools: WorkflowToolRef[];
    conversationContext?: string | null;
}

/**
 * Build prompt for generating workflow tool calls
 */
export const buildWorkflowToolCallPrompt = (
    params: WorkflowToolCallPromptParams
): string => {

    const conversationBlock = params.conversationContext
        ? `\nConversation history:\n${ params.conversationContext }\n`
        : '';

    return `You are a workflow builder assistant. You must use tool calls to change the workflow.
Workflows are deterministic procedures: each step is a prompt instruction whose output is piped to downstream steps.
Users will run these workflows later; you are editing the workflow definition now.
The workflow input is the user's chat message when they select this workflow.

Current workflow name: ${ params.workflowName }
Current workflow description: ${ params.workflowDescription ?? 'none' }

Current steps:
${ formatStepsForPrompt( params.dag ) }

Available tools:
${ formatToolsForPrompt( params.availableTools ) }

${ conversationBlock }
User request:
${ params.userMessage }

Guidelines:
- If the request requires a change, call one or more tools.
- Always use tool calls to add, update, delete, or reorder steps.
- Use the tool ids and versions exactly as listed.
- If you add a step and need to reference it later in this request, include tempId.
- Step instructions should be concise, actionable, and assume outputs from dependencies are available.
- Prefer adding prompt-only steps; tools are optional and handled separately.
- Step instructions should explicitly reference either the user input or a prior step output when relevant.
- Do not answer the user's question; only describe changes to the workflow definition.

After tool calls, respond with a short, user-facing summary of the changes.`;

};

/**
 * Parameters for building workflow tool usage prompts
 */
export interface WorkflowToolUsagePromptParams {
    userMessage: string;
    workflowName: string;
    workflowDescription: string | null;
    steps: WorkflowDAG['steps'];
    availableTools: WorkflowToolRef[];
    conversationContext?: string | null;
}

/**
 * Build prompt for classifying tool usage in workflow steps
 */
export const buildWorkflowToolUsagePrompt = (
    params: WorkflowToolUsagePromptParams
): string => {

    const conversationBlock = params.conversationContext
        ? `\nConversation history:\n${ params.conversationContext }\n`
        : '';

    return `You are a workflow tool usage classifier.
Workflows are deterministic procedures; steps are prompts whose outputs are piped to downstream steps.
Default to prompt-only steps. Only attach tools if explicitly requested or if a tool clearly improves reliability or adds required external data.
The workflow input is the user's chat message when they select this workflow.

Workflow name: ${ params.workflowName }
Workflow description: ${ params.workflowDescription ?? 'none' }

${ conversationBlock }
User request:
${ params.userMessage }

Candidate steps to classify:
${ formatCandidateStepsForPrompt( params.steps ) }

Available tools:
${ formatToolsForPrompt( params.availableTools ) }

Decision rules:
- Default to no tools.
- Only choose tools if the user explicitly requested a tool OR the step requires external data, side effects, or higher reliability.
- If you choose tools, include tool id and version exactly as listed above.
- Output JSON with the exact shape:
{"steps":[{"stepId":"string","useTools":true,"tools":[{"id":"string","version":"string"}]}]}
- Include every candidate step exactly once.
- If useTools is false, tools must be an empty array.
- Output JSON on a single line, no backticks, no extra text.`;

};

/**
 * Parameters for building workflow step plan prompts
 */
export interface WorkflowStepPlanPromptParams {
    userMessage: string;
    workflowName: string;
    workflowDescription: string | null;
    dag?: WorkflowDAG;
    conversationContext?: string | null;
}

/**
 * Build prompt for planning workflow steps
 */
export const buildWorkflowStepPlanPrompt = (
    params: WorkflowStepPlanPromptParams
): string => {

    const conversationBlock = params.conversationContext
        ? `\nConversation history:\n${ params.conversationContext }\n`
        : '';

    return `You are a workflow planner.
Workflows are deterministic, reusable procedures. Each step is a prompt instruction and outputs are piped to downstream steps.
The workflow input is the user's chat message when they select this workflow.
You are authoring steps, not executing them.

Workflow name: ${ params.workflowName }
Workflow description: ${ params.workflowDescription ?? 'none' }

Current steps:
${ formatStepsForPrompt( params.dag ) }

${ conversationBlock }
User request:
${ params.userMessage }

Plan new steps to satisfy the user request.
Output JSON with the exact shape:
{"steps":[{"name":"string","instruction":"string"}]}

Rules:
- Include only steps that should be added.
- Keep instructions concise and actionable.
- Do not include tools or dependencies.
- Step instructions should assume they will receive outputs from earlier steps.
- Step instructions should reference the user input or upstream outputs where appropriate.
- Output JSON on a single line, no backticks, no extra text.`;

};

/**
 * Parameters for building workflow step execution prompts
 */
export interface WorkflowStepExecutionPromptParams {
    userMessage: string;
    step: WorkflowStep;
    upstreamOutputs: string[];
    toolNames: string[];
}

/**
 * Build prompt for executing a workflow step
 */
export const buildWorkflowStepExecutionPrompt = (
    params: WorkflowStepExecutionPromptParams
): string => {
    const upstreamBlock = params.upstreamOutputs.length > 0
        ? params.upstreamOutputs.join( '\n\n' )
        : 'None';

    const toolsBlock = params.toolNames.length > 0
        ? `Available tools for this step: ${ params.toolNames.join( ', ' ) }`
        : 'No tools available for this step.';

    return `You are executing a single step in a deterministic workflow pipeline.

CRITICAL RULES:
1. You MUST follow the step instruction EXACTLY as written.
2. The "Workflow input" below is context data that may or may not be relevant to THIS step.
3. NEVER deviate from the step instruction, even if it seems unrelated to the workflow input.
4. NEVER comment on mismatches between the workflow input and the step instruction.
5. The workflow was designed intentionally - trust the step instruction completely.
6. Output ONLY the result of executing the step instruction. No meta-commentary.

Workflow input (context data):
${ params.userMessage }

Upstream step outputs:
${ upstreamBlock }

${ toolsBlock }

=== CURRENT STEP ===
Step name: ${ params.step.name }
Step instruction: ${ params.step.instruction }
====================

Execute the step instruction above and output ONLY the result.`;
};

/**
 * Parameters for building workflow history summary prompts
 */
export interface WorkflowHistorySummaryPromptParams {
    workflowName: string;
    conversationHistory: string;
    maxWords: number;
}

/**
 * Build prompt for summarizing workflow authoring conversation history
 */
export const buildWorkflowHistorySummaryPrompt = (
    params: WorkflowHistorySummaryPromptParams
): string => {
    return `Summarize the workflow authoring conversation so far for future context.
Workflow name: ${ params.workflowName }
Include the user's goals, any workflow steps agreed on, constraints, and tool preferences.
Keep it under ${ params.maxWords } words.

Conversation:
${ params.conversationHistory }`;
};

/**
 * Parameters for building workflow metadata prompts
 */
export interface WorkflowMetadataPromptParams {
    userMessage: string;
    dag?: WorkflowDAG;
}

/**
 * Build prompt for generating workflow name and description
 */
export const buildWorkflowMetadataPrompt = (
    params: WorkflowMetadataPromptParams
): string => {
    return `Generate a concise workflow name (2-6 words, title case) and a short description (1-2 sentences).

User request:
${ params.userMessage }

Current steps:
${ formatStepsSimple( params.dag ) }

Return ONLY valid JSON with this shape:
{ "name": string, "description": string }`;
};

/**
 * Build prompt for generating a chat title
 */
export const buildChatTitlePrompt = ( userMessage: string ): string => {
    return `Generate a short, concise title (maximum 6 words) for a chat that starts with this message: "${ userMessage }". Only respond with the title, nothing else.`;
};

/**
 * Parameters for building RAG augmented prompts
 */
export interface RAGAugmentedPromptParams {
    userPrompt: string;
    sourcesContext: string;
}

/**
 * Build prompt augmented with RAG search results
 */
export const buildRAGAugmentedPrompt = (
    params: RAGAugmentedPromptParams
): string => {
    return `You are a helpful assistant. Use the following web search results to answer the user's question. Cite sources when relevant.

Web Search Results:
${ params.sourcesContext }

User Question: ${ params.userPrompt }

Please provide a comprehensive answer based on the search results above.`;
};

/**
 * Format sources for RAG augmented prompts
 */
export const formatSourcesForRAGPrompt = (
    sources: Array<{ title: string; url: string; description?: string | null }>
): string => {
    return sources.map( ( source, index ) => {
        return `[${ index + 1 }] ${ source.title }\nURL: ${ source.url }\n${ source.description || '' }`;
    } ).join( '\n\n' );
};
