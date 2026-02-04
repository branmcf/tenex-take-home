import { generateText } from 'ai';
import {
    Either
    , error
    , success
} from '../../types';
import { ResourceError } from '../../errors';
import { getModelProvider } from './providers';
import { workflowTools } from './workflowTools';
import {
    buildWorkflowIntentPrompt
    , buildWorkflowToolCallPrompt
    , buildWorkflowToolUsagePrompt
    , buildWorkflowStepPlanPrompt
} from './workflowSystemPrompt';
import type { WorkflowToolRef, LLMToolCall, WorkflowDAG } from '../workflowDags';

interface WorkflowIntentResult {
    intent: 'modify_workflow' | 'ask_clarifying' | 'answer_only';
    assistantMessage: string;
    clarificationQuestion: string | null;
}

interface WorkflowToolUsageDecision {
    stepId: string;
    useTools: boolean;
    tools: Array<{ id: string; version: string }>;
}

interface WorkflowStepPlan {
    name: string;
    instruction: string;
}

class LLMWorkflowToolsRequestFailed extends ResourceError {
    public constructor () {
        const clientMessage = `Failed to get response from LLM.`;
        const code = 'LLM_WORKFLOW_TOOLS_REQUEST_FAILED';
        const statusCode = 500;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

const parseIntentJson = ( raw: string ): WorkflowIntentResult | null => {
    const stripCodeFence = ( value: string ) => {
        const trimmed = value.trim();

        if ( !trimmed.startsWith( '```' ) ) {
            return trimmed;
        }

        const fenceStart = trimmed.indexOf( '\n' );
        const fenceEnd = trimmed.lastIndexOf( '```' );

        if ( fenceStart === -1 || fenceEnd <= fenceStart ) {
            return trimmed.replace( /```/g, '' ).trim();
        }

        return trimmed.slice( fenceStart + 1, fenceEnd ).trim();
    };

    const extractStringField = ( source: string, fieldName: string ): string | null => {
        const closedRegex = new RegExp(
            `"${ fieldName }"\\s*:\\s*"([\\s\\S]*?)"(?:\\s*,\\s*"|\\s*\\}|\\s*$)`
            , 'm'
        );
        const closedMatch = source.match( closedRegex );

        if ( closedMatch && closedMatch[ 1 ] !== undefined ) {
            return closedMatch[ 1 ];
        }

        const openRegex = new RegExp( `"${ fieldName }"\\s*:\\s*"([\\s\\S]*)$`, 'm' );
        const openMatch = source.match( openRegex );

        if ( openMatch && openMatch[ 1 ] !== undefined ) {
            return openMatch[ 1 ];
        }

        return null;
    };

    const extractIntent = ( source: string ): WorkflowIntentResult['intent'] | null => {
        const match = source.match( /"intent"\s*:\s*"([^"]+)"/ );
        const intent = match?.[ 1 ] as WorkflowIntentResult['intent'] | undefined;

        if ( intent === 'modify_workflow' || intent === 'ask_clarifying' || intent === 'answer_only' ) {
            return intent;
        }

        return null;
    };

    const cleaned = stripCodeFence( raw );
    const start = cleaned.indexOf( '{' );
    const end = cleaned.lastIndexOf( '}' );

    if ( start >= 0 && end > start ) {
        try {
            const json = JSON.parse( cleaned.slice( start, end + 1 ) );
            if ( !json.intent ) {
                return null;
            }

            return {
                intent: json.intent
                , assistantMessage: json.assistantMessage ?? ''
                , clarificationQuestion: json.clarificationQuestion ?? null
            } as WorkflowIntentResult;
        } catch {
            // fall through to regex extraction
        }
    }

    const intent = extractIntent( cleaned );
    if ( !intent ) {
        return null;
    }

    const assistantMessage = extractStringField( cleaned, 'assistantMessage' );
    const clarificationQuestion = extractStringField( cleaned, 'clarificationQuestion' );

    return {
        intent
        , assistantMessage: assistantMessage ?? ''
        , clarificationQuestion: clarificationQuestion ?? null
    };
};

const parseToolUsageJson = ( raw: string ): { steps: WorkflowToolUsageDecision[] } | null => {
    const stripCodeFence = ( value: string ) => {
        const trimmed = value.trim();

        if ( !trimmed.startsWith( '```' ) ) {
            return trimmed;
        }

        const fenceStart = trimmed.indexOf( '\n' );
        const fenceEnd = trimmed.lastIndexOf( '```' );

        if ( fenceStart === -1 || fenceEnd <= fenceStart ) {
            return trimmed.replace( /```/g, '' ).trim();
        }

        return trimmed.slice( fenceStart + 1, fenceEnd ).trim();
    };

    const cleaned = stripCodeFence( raw );
    const start = cleaned.indexOf( '{' );
    const end = cleaned.lastIndexOf( '}' );

    if ( start >= 0 && end > start ) {
        try {
            const json = JSON.parse( cleaned.slice( start, end + 1 ) );
            if ( !Array.isArray( json.steps ) ) {
                return null;
            }

            const steps = json.steps
                .filter( ( step: WorkflowToolUsageDecision ) => step && typeof step.stepId === 'string' )
                .map( ( step: WorkflowToolUsageDecision ) => ( {
                    stepId: step.stepId
                    , useTools: Boolean( step.useTools )
                    , tools: Array.isArray( step.tools ) ? step.tools : []
                } ) );

            return { steps };
        } catch {
            return null;
        }
    }

    return null;
};

const parseStepPlanJson = ( raw: string ): { steps: WorkflowStepPlan[] } | null => {
    const stripCodeFence = ( value: string ) => {
        const trimmed = value.trim();

        if ( !trimmed.startsWith( '```' ) ) {
            return trimmed;
        }

        const fenceStart = trimmed.indexOf( '\n' );
        const fenceEnd = trimmed.lastIndexOf( '```' );

        if ( fenceStart === -1 || fenceEnd <= fenceStart ) {
            return trimmed.replace( /```/g, '' ).trim();
        }

        return trimmed.slice( fenceStart + 1, fenceEnd ).trim();
    };

    const cleaned = stripCodeFence( raw );
    const start = cleaned.indexOf( '{' );
    const end = cleaned.lastIndexOf( '}' );

    if ( start >= 0 && end > start ) {
        try {
            const json = JSON.parse( cleaned.slice( start, end + 1 ) );
            if ( !Array.isArray( json.steps ) ) {
                return null;
            }

            const steps = json.steps
                .filter( ( step: WorkflowStepPlan ) => step && typeof step.name === 'string' && typeof step.instruction === 'string' )
                .map( ( step: WorkflowStepPlan ) => ( {
                    name: step.name
                    , instruction: step.instruction
                } ) );

            return { steps };
        } catch {
            return null;
        }
    }

    return null;
};

const normalizeToolCalls = ( toolCalls: Array<{ toolName: string; input: unknown }> ): LLMToolCall[] => {
    return toolCalls.map( toolCall => ( {
        name: toolCall.toolName as LLMToolCall['name']
        , args: toolCall.input as LLMToolCall['args']
    } ) );
};

/**
 * generate workflow intent for a user message
 *
 * @param params - intent generation params
 * @returns Either<ResourceError, WorkflowIntentResult>
 */
export const generateWorkflowIntent = async (
    params: {
        userMessage: string;
        modelId: string;
        workflowName: string;
        workflowDescription: string | null;
        dag?: WorkflowDAG;
        availableTools: WorkflowToolRef[];
        conversationContext?: string | null;
    }
): Promise<Either<ResourceError, WorkflowIntentResult>> => {

    try {

        // build the intent prompt
        const prompt = buildWorkflowIntentPrompt( {
            userMessage: params.userMessage
            , workflowName: params.workflowName
            , workflowDescription: params.workflowDescription
            , dag: params.dag
            , availableTools: params.availableTools
            , conversationContext: params.conversationContext
        } );

        // generate the intent response
        const result = await generateText( {
            model: getModelProvider( params.modelId )
            , prompt
            , maxOutputTokens: 500
            , temperature: 0.2
        } );

        // parse the json response
        const rawText = result.text.trim();
        const parsed = parseIntentJson( rawText );

        if ( !parsed ) {
            const looksLikeJson = rawText.startsWith( '{' ) || rawText.includes( '"intent"' );

            if ( looksLikeJson ) {
                return success( {
                    intent: 'ask_clarifying'
                    , assistantMessage: 'I can update the workflow. What should I change?'
                    , clarificationQuestion: 'What should I change in this workflow?'
                } );
            }

            return success( {
                intent: 'answer_only'
                , assistantMessage: rawText
                , clarificationQuestion: null
            } );
        }

        return success( parsed );
    } catch {
        return error( new LLMWorkflowToolsRequestFailed() );
    }

};

/**
 * generate workflow tool calls and assistant message
 *
 * @param params - tool call generation params
 * @returns Either<ResourceError, { assistantMessage, toolCalls }>
 */
export const generateWorkflowToolCalls = async (
    params: {
        userMessage: string;
        modelId: string;
        workflowName: string;
        workflowDescription: string | null;
        dag?: WorkflowDAG;
        availableTools: WorkflowToolRef[];
        conversationContext?: string | null;
    }
): Promise<Either<ResourceError, { assistantMessage: string; toolCalls: LLMToolCall[] }>> => {

    try {
        const prompt = buildWorkflowToolCallPrompt( {
            userMessage: params.userMessage
            , workflowName: params.workflowName
            , workflowDescription: params.workflowDescription
            , dag: params.dag
            , availableTools: params.availableTools
            , conversationContext: params.conversationContext
        } );

        const result = await generateText( {
            model: getModelProvider( params.modelId )
            , prompt
            , maxOutputTokens: 1200
            , temperature: 0.3
            , tools: workflowTools
            , toolChoice: 'auto'
        } );

        const toolCalls = normalizeToolCalls( ( result.toolCalls ?? [] ).map( call => ( {
            toolName: call.toolName
            , input: call.input
        } ) ) );

        return success( {
            assistantMessage: result.text.trim()
            , toolCalls
        } );
    } catch {
        return error( new LLMWorkflowToolsRequestFailed() );
    }

};

/**
 * classify tool usage for workflow steps
 *
 * @param params - tool usage classification params
 * @returns Either<ResourceError, { steps }>
 */
export const generateWorkflowStepToolUsage = async (
    params: {
        userMessage: string;
        modelId: string;
        workflowName: string;
        workflowDescription: string | null;
        steps: WorkflowDAG['steps'];
        availableTools: WorkflowToolRef[];
        conversationContext?: string | null;
    }
): Promise<Either<ResourceError, { steps: WorkflowToolUsageDecision[] }>> => {

    try {
        const prompt = buildWorkflowToolUsagePrompt( {
            userMessage: params.userMessage
            , workflowName: params.workflowName
            , workflowDescription: params.workflowDescription
            , steps: params.steps
            , availableTools: params.availableTools
            , conversationContext: params.conversationContext
        } );

        const result = await generateText( {
            model: getModelProvider( params.modelId )
            , prompt
            , maxOutputTokens: 800
            , temperature: 0.2
        } );

        const rawText = result.text.trim();
        const parsed = parseToolUsageJson( rawText );

        if ( !parsed ) {
            return error( new LLMWorkflowToolsRequestFailed() );
        }

        return success( parsed );
    } catch {
        return error( new LLMWorkflowToolsRequestFailed() );
    }

};

/**
 * generate a workflow step plan when tool calls are missing
 *
 * @param params - step planning params
 * @returns Either<ResourceError, { steps }>
 */
export const generateWorkflowStepPlan = async (
    params: {
        userMessage: string;
        modelId: string;
        workflowName: string;
        workflowDescription: string | null;
        dag?: WorkflowDAG;
        conversationContext?: string | null;
    }
): Promise<Either<ResourceError, { steps: WorkflowStepPlan[] }>> => {

    try {
        const prompt = buildWorkflowStepPlanPrompt( {
            userMessage: params.userMessage
            , workflowName: params.workflowName
            , workflowDescription: params.workflowDescription
            , dag: params.dag
            , conversationContext: params.conversationContext
        } );

        const result = await generateText( {
            model: getModelProvider( params.modelId )
            , prompt
            , maxOutputTokens: 900
            , temperature: 0.3
        } );

        const rawText = result.text.trim();
        const parsed = parseStepPlanJson( rawText );

        if ( !parsed ) {
            return error( new LLMWorkflowToolsRequestFailed() );
        }

        return success( parsed );
    } catch {
        return error( new LLMWorkflowToolsRequestFailed() );
    }

};
