import {
    Either
    , error
    , success
} from '../../types';
import { ResourceError } from '../../errors';
import {
    generateWorkflowIntent
    , generateWorkflowToolCalls
    , generateWorkflowStepToolUsage
    , generateWorkflowStepPlan
    , generateLLMText
} from '../../lib/llm';
import { WorkflowChatLLMRequestFailed } from './workflowChatMessages.errors';
import {
    applyToolCallsToDag
    , WorkflowDAG
    , WorkflowToolRef
    , validateWorkflowDag
} from '../../lib/workflowDags';
import { getWorkflowById, getLatestWorkflowVersion } from '../workflows/workflows.service';
import { getWorkflowChatMessages } from './workflowChatMessages.service';
import { getCachedTools } from '../tools/tools.helper';
import { storeWorkflowProposal } from '../../lib/workflowProposals';

const buildToolRefs = ( tools: Array<{ id: string; name: string; version?: string | null; externalId?: string | null }> ): WorkflowToolRef[] => {
    return tools.map( tool => ( {
        id: tool.externalId ?? tool.id
        , name: tool.name
        , version: tool.version ?? '1.0.0'
    } ) );
};

const normalizeDag = ( dag: unknown ): WorkflowDAG => {
    const fallback: WorkflowDAG = { steps: [] };

    if ( !dag || typeof dag !== 'object' ) {
        return fallback;
    }

    const maybeDag = dag as WorkflowDAG;

    if ( !Array.isArray( maybeDag.steps ) ) {
        return fallback;
    }

    return {
        steps: maybeDag.steps.map( step => ( {
            id: step.id
            , name: step.name
            , instruction: step.instruction
            , tools: step.tools ?? []
            , dependsOn: step.dependsOn ?? []
        } ) )
    };
};

const normalizeToolKey = ( tool: WorkflowToolRef ) => {
    const id = tool.id;
    const version = tool.version ?? '';
    return `${ id }::${ version }`;
};

const buildToolLookup = ( tools: WorkflowToolRef[] ) => {
    const lookup = new Map<string, WorkflowToolRef>();

    tools.forEach( tool => {
        lookup.set( normalizeToolKey( tool ), tool );
        lookup.set( `${ tool.id }::`, tool );
    } );

    return lookup;
};

const resolveToolRefs = (
    tools: Array<{ id: string; version?: string }> | undefined
    , availableTools: WorkflowToolRef[]
): WorkflowToolRef[] => {

    const toolLookup = buildToolLookup( availableTools );

    return ( tools ?? [] ).map( toolInput => {
        const lookupKey = `${ toolInput.id }::${ toolInput.version ?? '' }`;
        const resolved = toolLookup.get( lookupKey ) ?? toolLookup.get( `${ toolInput.id }::` );

        return {
            id: toolInput.id
            , name: resolved?.name ?? toolInput.id
            , version: toolInput.version ?? resolved?.version
        };
    } );
};

const normalizeToolList = ( tools?: WorkflowToolRef[] ) => {
    return ( tools ?? [] )
        .map( tool => `${ tool.id }::${ tool.version ?? '' }` )
        .sort();
};

const normalizeDependsOn = ( dependsOn?: string[] ) => {
    return dependsOn ?? [];
};

const stepsMatch = ( left: WorkflowDAG['steps'][number], right: WorkflowDAG['steps'][number] ) => {
    if ( left.name !== right.name ) {
        return false;
    }

    if ( left.instruction !== right.instruction ) {
        return false;
    }

    const leftDependsOn = normalizeDependsOn( left.dependsOn );
    const rightDependsOn = normalizeDependsOn( right.dependsOn );

    if ( leftDependsOn.length !== rightDependsOn.length ) {
        return false;
    }

    for ( let i = 0; i < leftDependsOn.length; i += 1 ) {
        if ( leftDependsOn[ i ] !== rightDependsOn[ i ] ) {
            return false;
        }
    }

    const leftTools = normalizeToolList( left.tools );
    const rightTools = normalizeToolList( right.tools );

    if ( leftTools.length !== rightTools.length ) {
        return false;
    }

    for ( let i = 0; i < leftTools.length; i += 1 ) {
        if ( leftTools[ i ] !== rightTools[ i ] ) {
            return false;
        }
    }

    return true;
};

const getStepsNeedingToolUsageDecision = ( currentDag: WorkflowDAG, proposedDag: WorkflowDAG ) => {
    const currentStepMap = new Map( currentDag.steps.map( step => ( [ step.id, step ] ) ) );

    return proposedDag.steps.filter( step => {
        const currentStep = currentStepMap.get( step.id );
        if ( !currentStep ) {
            return true;
        }

        return !stepsMatch( currentStep, step );
    } );
};

const applyToolUsageDecisions = (
    params: {
        dag: WorkflowDAG;
        decisions: Array<{ stepId: string; useTools: boolean; tools: Array<{ id: string; version: string }> }>;
        candidateStepIds: string[];
        availableTools: WorkflowToolRef[];
    }
): WorkflowDAG => {

    const decisionMap = new Map(
        params.decisions.map( decision => ( [ decision.stepId, decision ] ) )
    );
    const candidateSet = new Set( params.candidateStepIds );

    return {
        steps: params.dag.steps.map( step => {
            const decision = decisionMap.get( step.id );

            if ( decision ) {
                if ( !decision.useTools ) {
                    return { ...step, tools: [] };
                }

                return {
                    ...step
                    , tools: resolveToolRefs( decision.tools, params.availableTools )
                };
            }

            if ( candidateSet.has( step.id ) ) {
                return { ...step, tools: [] };
            }

            return step;
        } )
    };
};

const buildNoToolsDecisions = ( steps: WorkflowDAG['steps'] ) => {
    return steps.map( step => ( {
        stepId: step.id
        , useTools: false
        , tools: []
    } ) );
};

const buildAddStepToolCalls = ( steps: Array<{ name: string; instruction: string }> ) => {
    return steps.map( ( step, index ) => {
        const tempId = `temp_step_${ index + 1 }`;
        const afterStepId = index === 0 ? undefined : `temp_step_${ index }`;

        return {
            name: 'add_step' as const
            , args: {
                tempId
                , name: step.name
                , instruction: step.instruction
                , position: index === 0 ? 'start' as const : 'after' as const
                , afterStepId
            }
        };
    } );
};

const buildDraftAssistantMessage = ( stepCount: number ) => {
    if ( stepCount <= 0 ) {
        return 'I prepared a draft workflow. Review the proposed changes below and apply if they look right.';
    }

    return `I drafted ${ stepCount } step${ stepCount !== 1 ? 's' : '' } for your workflow. Review the proposed changes below and apply if they look right.`;
};

const HISTORY_SUMMARY_TRIGGER = 12;
const HISTORY_RECENT_MESSAGES = 8;
const HISTORY_SUMMARY_MAX_WORDS = 140;

type WorkflowChatHistoryMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt: string;
};

const normalizeRole = ( role: string ): WorkflowChatHistoryMessage['role'] => {
    const normalized = role.toLowerCase();

    if ( normalized === 'user' || normalized === 'assistant' || normalized === 'system' ) {
        return normalized;
    }

    return 'assistant';
};

const normalizeWorkflowHistory = (
    messages: Array<{ role: string; content: string; createdAt: string } | null>
    , currentUserMessage: string
): WorkflowChatHistoryMessage[] => {

    const normalized = messages
        .filter( ( message ): message is NonNullable<typeof message> => message !== null )
        .map( message => ( {
            role: normalizeRole( message.role )
            , content: message.content
            , createdAt: message.createdAt
        } ) )
        .filter( message => message.content && message.content.trim().length > 0 );

    if ( normalized.length === 0 ) {
        return [];
    }

    const lastMessage = normalized[ normalized.length - 1 ];
    const trimmedCurrent = currentUserMessage.trim();

    if ( lastMessage.role === 'user' && lastMessage.content.trim() === trimmedCurrent ) {
        return normalized.slice( 0, -1 );
    }

    return normalized;
};

const formatConversationHistory = ( messages: WorkflowChatHistoryMessage[] ) => {
    return messages.map( message => {
        const label = message.role === 'user'
            ? 'User'
            : message.role === 'assistant'
                ? 'Assistant'
                : 'System';
        return `${ label }: ${ message.content }`;
    } ).join( '\n' );
};

const summarizeWorkflowHistory = async (
    params: {
        messages: WorkflowChatHistoryMessage[];
        modelId: string;
        workflowName: string;
    }
): Promise<string | null> => {

    if ( params.messages.length === 0 ) {
        return null;
    }

    const prompt = `Summarize the workflow authoring conversation so far for future context.
Workflow name: ${ params.workflowName }
Include the user's goals, any workflow steps agreed on, constraints, and tool preferences.
Keep it under ${ HISTORY_SUMMARY_MAX_WORDS } words.

Conversation:
${ formatConversationHistory( params.messages ) }`;

    const summaryResult = await generateLLMText( {
        modelId: params.modelId
        , prompt
        , maxTokens: 300
        , temperature: 0.2
        , useRAG: false
    } );

    if ( summaryResult.isError() ) {
        return null;
    }

    return summaryResult.value.content.trim();
};

const buildConversationContext = (
    summary: string | null
    , recentMessages: WorkflowChatHistoryMessage[]
): string | null => {

    if ( recentMessages.length === 0 && !summary ) {
        return null;
    }

    const recentBlock = recentMessages.length > 0
        ? formatConversationHistory( recentMessages )
        : '';

    if ( summary && summary.length > 0 && recentBlock.length > 0 ) {
        return `Summary of earlier messages: ${ summary }\n\nRecent messages:\n${ recentBlock }`;
    }

    if ( summary && summary.length > 0 ) {
        return `Summary of earlier messages: ${ summary }`;
    }

    return `Recent messages:\n${ recentBlock }`;
};

const generateStepId = () => {
    return `step_${ Date.now() }_${ Math.floor( Math.random() * 100000 ) }`;
};

const normalizeAssistantContent = (
    content: string | null | undefined
    , hasProposedChanges: boolean
): string => {
    const trimmed = ( content ?? '' ).trim();

    if ( trimmed.length > 0 ) {
        return trimmed;
    }

    if ( hasProposedChanges ) {
        return 'I prepared proposed changes for your workflow. Review them below and apply if they look right.';
    }

    return 'Could you clarify what you want to change in this workflow?';
};

const appendProposalPrompt = ( content: string ): string => {
    const normalized = content.toLowerCase();
    const alreadyMentionsApproval = normalized.includes( 'apply' )
        || normalized.includes( 'reject' )
        || normalized.includes( 'approve' );

    if ( alreadyMentionsApproval ) {
        return content;
    }

    return `${ content }\n\nReview the proposed changes below and click Apply Changes or Reject.`;
};

/**
 * generate a response from the LLM for workflow authoring
 *
 * @param params - the parameters for generating the response
 * @returns Either<ResourceError, { content: string }>
 */
export const generateWorkflowChatResponse = async (
    params: {
        workflowId: string;
        userMessage: string;
        modelId: string;
    }
): Promise<Either<ResourceError, { content: string; proposedChanges?: { proposalId: string; baseVersionId: string | null; toolCalls: unknown; previewSteps: WorkflowDAG['steps'] } }>> => {

    // get workflow details
    const workflowResult = await getWorkflowById( params.workflowId );

    if ( workflowResult.isError() ) {
        return error( workflowResult.value );
    }

    const workflow = workflowResult.value;

    // get latest workflow version
    const latestVersionResult = await getLatestWorkflowVersion( params.workflowId );

    if ( latestVersionResult.isError() ) {
        return error( latestVersionResult.value );
    }

    const latestVersion = latestVersionResult.value;
    const currentDag = normalizeDag( latestVersion?.dag ?? { steps: [] } );

    // build conversation context from workflow chat history
    let conversationContext: string | null = null;
    const historyResult = await getWorkflowChatMessages( params.workflowId );

    if ( !historyResult.isError() ) {
        const normalizedHistory = normalizeWorkflowHistory( historyResult.value ?? [], params.userMessage );

        if ( normalizedHistory.length > 0 ) {
            if ( normalizedHistory.length > HISTORY_SUMMARY_TRIGGER ) {
                const cutoffIndex = Math.max( normalizedHistory.length - HISTORY_RECENT_MESSAGES, 0 );
                const olderMessages = normalizedHistory.slice( 0, cutoffIndex );
                const recentMessages = normalizedHistory.slice( cutoffIndex );

                const summary = await summarizeWorkflowHistory( {
                    messages: olderMessages
                    , modelId: params.modelId
                    , workflowName: workflow.name
                } );

                conversationContext = buildConversationContext( summary, recentMessages );
            } else {
                conversationContext = buildConversationContext( null, normalizedHistory );
            }
        }
    }

    // load cached tools (tools are optional for workflow authoring)
    let availableTools: WorkflowToolRef[] = [];
    let cachedToolsResult = await getCachedTools( false );

    if ( cachedToolsResult.isError() ) {
        console.warn( 'workflow chat: failed to load cached tools, continuing without tools', cachedToolsResult.value );
    } else if ( cachedToolsResult.value.length > 0 ) {
        availableTools = buildToolRefs( cachedToolsResult.value );
    } else {
        // attempt a refresh, but don't fail if MCP is unavailable
        cachedToolsResult = await getCachedTools( true );
        if ( cachedToolsResult.isError() ) {
            console.warn( 'workflow chat: failed to refresh tools, continuing without tools', cachedToolsResult.value );
        } else {
            availableTools = buildToolRefs( cachedToolsResult.value );
        }
    }

    // generate intent
    const intentResult = await generateWorkflowIntent( {
        userMessage: params.userMessage
        , modelId: params.modelId
        , workflowName: workflow.name
        , workflowDescription: workflow.description ?? null
        , dag: currentDag
        , availableTools
        , conversationContext
    } );

    if ( intentResult.isError() ) {
        return error( new WorkflowChatLLMRequestFailed() );
    }

    if ( intentResult.value.intent === 'ask_clarifying' ) {
        return success( {
            content: normalizeAssistantContent(
                intentResult.value.clarificationQuestion ?? intentResult.value.assistantMessage
                , false
            )
        } );
    }

    if ( intentResult.value.intent === 'answer_only' ) {
        return success( {
            content: normalizeAssistantContent( intentResult.value.assistantMessage, false )
        } );
    }

    // generate tool calls
    const toolCallResult = await generateWorkflowToolCalls( {
        userMessage: params.userMessage
        , modelId: params.modelId
        , workflowName: workflow.name
        , workflowDescription: workflow.description ?? null
        , dag: currentDag
        , availableTools
        , conversationContext
    } );

    if ( toolCallResult.isError() ) {
        return error( new WorkflowChatLLMRequestFailed() );
    }

    // set up proposal inputs
    let proposedToolCalls = toolCallResult.value.toolCalls;
    let assistantMessage = toolCallResult.value.assistantMessage;

    // fall back to step planning when no tool calls were produced for an empty workflow
    if ( proposedToolCalls.length === 0 && currentDag.steps.length === 0 ) {

        // generate a step plan
        const stepPlanResult = await generateWorkflowStepPlan( {
            userMessage: params.userMessage
            , modelId: params.modelId
            , workflowName: workflow.name
            , workflowDescription: workflow.description ?? null
            , dag: currentDag
            , conversationContext
        } );

        if ( !stepPlanResult.isError() && stepPlanResult.value.steps.length > 0 ) {

            // build tool calls from the planned steps
            proposedToolCalls = buildAddStepToolCalls( stepPlanResult.value.steps );
            assistantMessage = buildDraftAssistantMessage( stepPlanResult.value.steps.length );
        }
    }

    // return early if we still have no tool calls to apply
    if ( proposedToolCalls.length === 0 ) {
        return success( {
            content: normalizeAssistantContent( assistantMessage, false )
        } );
    }

    // apply tool calls to generate proposal dag
    const applyResult = applyToolCallsToDag( {
        dag: currentDag
        , toolCalls: proposedToolCalls
        , availableTools
        , idGenerator: generateStepId
    } );

    if ( applyResult.isError() ) {
        return error( applyResult.value );
    }

    const proposedDag = applyResult.value;

    // decide tool usage for steps that were added or changed
    const stepsNeedingToolUsage = getStepsNeedingToolUsageDecision( currentDag, proposedDag );

    let finalizedDag = proposedDag;

    if ( stepsNeedingToolUsage.length > 0 ) {
        const toolUsageResult = await generateWorkflowStepToolUsage( {
            userMessage: params.userMessage
            , modelId: params.modelId
            , workflowName: workflow.name
            , workflowDescription: workflow.description ?? null
            , steps: stepsNeedingToolUsage
            , availableTools
            , conversationContext
        } );

        const decisions = toolUsageResult.isError()
            ? buildNoToolsDecisions( stepsNeedingToolUsage )
            : toolUsageResult.value.steps;

        finalizedDag = applyToolUsageDecisions( {
            dag: proposedDag
            , decisions
            , candidateStepIds: stepsNeedingToolUsage.map( step => step.id )
            , availableTools
        } );
    }

    // validate the finalized dag after tool usage decisions
    const toolUsageValidationResult = validateWorkflowDag( {
        dag: finalizedDag
        , validTools: availableTools
    } );

    if ( toolUsageValidationResult.isError() ) {
        return error( toolUsageValidationResult.value );
    }

    // store proposal
    const expiresAt = new Date( Date.now() + 5 * 60 * 1000 ).toISOString();

    const storeResult = await storeWorkflowProposal( {
        workflowId: params.workflowId
        , baseVersionId: latestVersion?.id ?? null
        , userMessage: params.userMessage
        , modelId: params.modelId
        , toolCalls: proposedToolCalls
        , proposedDag: finalizedDag
        , expiresAt
    } );

    if ( storeResult.isError() ) {
        return error( storeResult.value );
    }

    const normalizedMessage = normalizeAssistantContent( assistantMessage, true );

    return success( {
        content: appendProposalPrompt( normalizedMessage )
        , proposedChanges: {
            proposalId: storeResult.value.id
            , baseVersionId: latestVersion?.id ?? null
            , toolCalls: proposedToolCalls
            , previewSteps: finalizedDag.steps
        }
    } );

};
