import { gql } from 'graphile-utils';
import { generateText, tool, jsonSchema } from 'ai';
import {
    Either
    , error
    , success
} from '../types';
import { ResourceError } from '../errors';
import { getModelProvider } from './llm/providers';
import { postGraphileRequest } from './postGraphile';
import { runMcpTool, MCPTool } from './mcpToolsServer';
import { getCachedTools } from '../app/tools/tools.helper';
import { getWorkflowById } from '../app/workflows/workflows.service';
import {
    validateWorkflowDag
    , WorkflowDAG
    , WorkflowStep
    , WorkflowToolRef
} from './workflowDags';

interface WorkflowRunResult {
    workflowRunId: string;
    content: string;
}

const buildToolKey = ( tool: WorkflowToolRef ) => {
    return `${ tool.id }::${ tool.version ?? '' }`;
};

const buildToolRecordLookup = ( tools: MCPTool[] ) => {
    const lookup = new Map<string, MCPTool>();

    tools.forEach( toolRecord => {
        const key = `${ toolRecord.id }::${ toolRecord.version ?? '' }`;
        lookup.set( key, toolRecord );
        lookup.set( `${ toolRecord.id }::`, toolRecord );
    } );

    return lookup;
};

const buildMcpToolsFromCache = (
    tools: Array<{ id: string; name: string; description?: string | null; schema?: Record<string, unknown> | null; version?: string | null; tags?: string[] | null; externalId?: string | null }>
) => {
    return tools.map( toolRecord => ( {
        id: toolRecord.externalId ?? toolRecord.id
        , name: toolRecord.name
        , description: toolRecord.description ?? null
        , schema: toolRecord.schema ?? {}
        , version: toolRecord.version ?? '1.0.0'
        , tags: toolRecord.tags ?? []
    } ) );
};

const findMissingToolRefs = ( toolRefs: WorkflowToolRef[], lookup: Map<string, MCPTool> ) => {
    return toolRefs.filter( toolRef => {
        const lookupKey = buildToolKey( toolRef );
        return !lookup.has( lookupKey ) && !lookup.has( `${ toolRef.id }::` );
    } );
};

const buildStepPrompt = (
    params: {
        userMessage: string;
        step: WorkflowStep;
        upstreamOutputs: string[];
        toolNames: string[];
    }
) => {
    const upstreamBlock = params.upstreamOutputs.length > 0
        ? params.upstreamOutputs.join( '\n\n' )
        : 'None';

    const toolsBlock = params.toolNames.length > 0
        ? `Available tools for this step: ${ params.toolNames.join( ', ' ) }`
        : 'No tools available for this step.';

    return `Workflow input (user message):
${ params.userMessage }

Upstream outputs:
${ upstreamBlock }

${ toolsBlock }

Current step: ${ params.step.name }
Instruction: ${ params.step.instruction }

Provide the step output only. If tools are available and helpful, use them.`;
};

const topologicalSortSteps = ( steps: WorkflowStep[] ) => {
    const stepMap = new Map( steps.map( step => [ step.id, step ] ) );
    const indegree = new Map<string, number>();
    const dependents = new Map<string, string[]>();

    steps.forEach( step => {
        indegree.set( step.id, 0 );
        dependents.set( step.id, [] );
    } );

    steps.forEach( step => {
        const deps = step.dependsOn ?? [];
        deps.forEach( depId => {
            if ( !stepMap.has( depId ) ) {
                return;
            }
            indegree.set( step.id, ( indegree.get( step.id ) ?? 0 ) + 1 );
            dependents.get( depId )?.push( step.id );
        } );
    } );

    const queue: WorkflowStep[] = [];
    steps.forEach( step => {
        if ( ( indegree.get( step.id ) ?? 0 ) === 0 ) {
            queue.push( step );
        }
    } );

    const sorted: WorkflowStep[] = [];

    while ( queue.length > 0 ) {
        const step = queue.shift();
        if ( !step ) {
            continue;
        }
        sorted.push( step );

        const outgoing = dependents.get( step.id ) ?? [];
        outgoing.forEach( nextId => {
            const nextIndegree = ( indegree.get( nextId ) ?? 0 ) - 1;
            indegree.set( nextId, nextIndegree );
            if ( nextIndegree === 0 ) {
                const nextStep = stepMap.get( nextId );
                if ( nextStep ) {
                    queue.push( nextStep );
                }
            }
        } );
    }

    return sorted;
};

const createWorkflowRun = async (
    params: {
        workflowVersionId: string;
        chatId: string;
        triggerMessageId: string;
    }
): Promise<Either<ResourceError, { id: string }>> => {

    const CREATE_WORKFLOW_RUN = gql`
        mutation createWorkflowRun(
            $workflowVersionId: UUID!
            $chatId: UUID!
            $triggerMessageId: UUID!
            $status: WorkflowRunStatus!
        ) {
            createWorkflowRun(input: {
                workflowRun: {
                    workflowVersionId: $workflowVersionId
                    chatId: $chatId
                    triggerMessageId: $triggerMessageId
                    status: $status
                }
            }) {
                workflowRun {
                    id
                }
            }
        }
    `;

    const result = await postGraphileRequest<any, any>( {
        mutation: CREATE_WORKFLOW_RUN
        , variables: {
            workflowVersionId: params.workflowVersionId
            , chatId: params.chatId
            , triggerMessageId: params.triggerMessageId
            , status: 'RUNNING'
        }
    } );

    if ( result.isError() ) {
        return error( result.value );
    }

    const workflowRunId = result.value?.createWorkflowRun?.workflowRun?.id;
    if ( !workflowRunId ) {
        return error( new ResourceError( { message: 'Failed to create workflow run.' } ) );
    }

    return success( { id: workflowRunId } );
};

const updateWorkflowRunStatus = async (
    params: {
        workflowRunId: string;
        status: 'PASSED' | 'FAILED' | 'CANCELLED';
        completedAt: string;
    }
): Promise<Either<ResourceError, void>> => {

    const UPDATE_WORKFLOW_RUN = gql`
        mutation updateWorkflowRun(
            $workflowRunId: UUID!
            $status: WorkflowRunStatus!
            $completedAt: Datetime!
        ) {
            updateWorkflowRunById(input: {
                id: $workflowRunId
                workflowRunPatch: {
                    status: $status
                    completedAt: $completedAt
                }
            }) {
                workflowRun {
                    id
                }
            }
        }
    `;

    const result = await postGraphileRequest<any, any>( {
        mutation: UPDATE_WORKFLOW_RUN
        , variables: {
            workflowRunId: params.workflowRunId
            , status: params.status
            , completedAt: params.completedAt
        }
    } );

    if ( result.isError() ) {
        return error( result.value );
    }

    return success( undefined );
};

const createStepRun = async (
    params: {
        workflowRunId: string;
        stepId: string;
        startedAt: string;
    }
): Promise<Either<ResourceError, void>> => {

    const CREATE_STEP_RUN = gql`
        mutation createStepRun(
            $workflowRunId: UUID!
            $stepId: String!
            $status: StepRunStatus!
            $startedAt: Datetime!
        ) {
            createStepRun(input: {
                stepRun: {
                    workflowRunId: $workflowRunId
                    stepId: $stepId
                    status: $status
                    startedAt: $startedAt
                }
            }) {
                stepRun {
                    id
                }
            }
        }
    `;

    const result = await postGraphileRequest<any, any>( {
        mutation: CREATE_STEP_RUN
        , variables: {
            workflowRunId: params.workflowRunId
            , stepId: params.stepId
            , status: 'RUNNING'
            , startedAt: params.startedAt
        }
    } );

    if ( result.isError() ) {
        return error( result.value );
    }

    return success( undefined );
};

const updateStepRun = async (
    params: {
        workflowRunId: string;
        stepId: string;
        status: 'PASSED' | 'FAILED' | 'CANCELLED';
        output?: string;
        errorMessage?: string;
        toolCalls?: unknown;
        logs?: unknown;
        completedAt: string;
    }
): Promise<Either<ResourceError, void>> => {

    const UPDATE_STEP_RUN = gql`
        mutation updateStepRun(
            $workflowRunId: UUID!
            $stepId: String!
            $status: StepRunStatus!
            $output: String
            $error: String
            $toolCalls: JSON
            $logs: JSON
            $completedAt: Datetime!
        ) {
            updateStepRunByWorkflowRunIdAndStepId(input: {
                workflowRunId: $workflowRunId
                stepId: $stepId
                stepRunPatch: {
                    status: $status
                    output: $output
                    error: $error
                    toolCalls: $toolCalls
                    logs: $logs
                    completedAt: $completedAt
                }
            }) {
                stepRun {
                    id
                }
            }
        }
    `;

    const result = await postGraphileRequest<any, any>( {
        mutation: UPDATE_STEP_RUN
        , variables: {
            workflowRunId: params.workflowRunId
            , stepId: params.stepId
            , status: params.status
            , output: params.output ?? null
            , error: params.errorMessage ?? null
            , toolCalls: params.toolCalls ?? null
            , logs: params.logs ?? null
            , completedAt: params.completedAt
        }
    } );

    if ( result.isError() ) {
        return error( result.value );
    }

    return success( undefined );
};

const buildRuntimeTools = (
    stepTools: WorkflowToolRef[]
    , toolLookup: Map<string, MCPTool>
) => {
    const tools: Record<string, ReturnType<typeof tool>> = {};
    const toolNames: string[] = [];

    stepTools.forEach( toolRef => {
        const lookupKey = buildToolKey( toolRef );
        const toolRecord = toolLookup.get( lookupKey ) ?? toolLookup.get( `${ toolRef.id }::` );

        if ( !toolRecord ) {
            return;
        }

        const toolName = toolRecord.name;
        toolNames.push( toolName );

        tools[ toolName ] = tool( {
            description: toolRecord.description ?? toolName
            , inputSchema: jsonSchema( toolRecord.schema as Record<string, unknown> )
            , outputSchema: jsonSchema( { type: 'object', additionalProperties: true } )
            , execute: async ( input: Record<string, unknown> ) => {
                const runResult = await runMcpTool( {
                    id: toolRecord.id
                    , version: toolRecord.version
                    , input
                } );

                if ( runResult.isError() ) {
                    throw runResult.value;
                }

                return runResult.value.output;
            }
        } );
    } );

    return {
        tools
        , toolNames
    };
};

export const runWorkflow = async (
    params: {
        workflowId: string;
        chatId: string;
        triggerMessageId: string;
        userMessage: string;
        modelId: string;
    }
): Promise<Either<ResourceError, WorkflowRunResult>> => {

    const workflowResult = await getWorkflowById( params.workflowId );
    if ( workflowResult.isError() ) {
        return error( workflowResult.value );
    }

    const workflow = workflowResult.value;
    const latestVersion = workflow.workflowVersionsByWorkflowId?.nodes?.[ 0 ];

    if ( !latestVersion || !latestVersion.dag ) {
        return error( new ResourceError( { message: 'Workflow has no version to run.' } ) );
    }

    const dag = latestVersion.dag as WorkflowDAG;
    const validationResult = validateWorkflowDag( { dag } );
    if ( validationResult.isError() ) {
        return error( validationResult.value );
    }

    // set up tool lookup (may remain empty when no tools are needed)
    let toolLookup = new Map<string, MCPTool>();

    // create workflow run
    const workflowRunResult = await createWorkflowRun( {
        workflowVersionId: latestVersion.id
        , chatId: params.chatId
        , triggerMessageId: params.triggerMessageId
    } );

    if ( workflowRunResult.isError() ) {
        return error( workflowRunResult.value );
    }

    const workflowRunId = workflowRunResult.value.id;
    const outputs: Record<string, string> = {};

    const orderedSteps = topologicalSortSteps( dag.steps ?? [] );

    // if any step references tools, ensure we have tool definitions loaded
    const requiredToolRefs = orderedSteps.flatMap( step => step.tools ?? [] );
    if ( requiredToolRefs.length > 0 ) {
        const cachedToolsResult = await getCachedTools( false );
        if ( cachedToolsResult.isError() ) {
            const completedAt = new Date().toISOString();
            await updateWorkflowRunStatus( {
                workflowRunId
                , status: 'FAILED'
                , completedAt
            } );
            return error( cachedToolsResult.value );
        }

        toolLookup = buildToolRecordLookup( buildMcpToolsFromCache( cachedToolsResult.value ) );

        const missingTools = findMissingToolRefs( requiredToolRefs, toolLookup );
        if ( missingTools.length > 0 ) {
            const refreshResult = await getCachedTools( true );
            if ( refreshResult.isError() ) {
                const completedAt = new Date().toISOString();
                await updateWorkflowRunStatus( {
                    workflowRunId
                    , status: 'FAILED'
                    , completedAt
                } );
                return error( refreshResult.value );
            }

            toolLookup = buildToolRecordLookup( buildMcpToolsFromCache( refreshResult.value ) );
        }
    }

    let activeStepId: string | null = null;

    try {
        for ( const step of orderedSteps ) {
            const startedAt = new Date().toISOString();

            const createStepRunResult = await createStepRun( {
                workflowRunId
                , stepId: step.id
                , startedAt
            } );

            if ( createStepRunResult.isError() ) {
                throw createStepRunResult.value;
            }

            activeStepId = step.id;

            const upstreamOutputs = ( step.dependsOn ?? [] )
                .map( depId => {
                    const output = outputs[ depId ] ?? '';
                    return `Output from ${ depId }:\n${ output }`;
                } )
                .filter( entry => entry.trim().length > 0 );

            const runtimeTools = buildRuntimeTools( step.tools ?? [], toolLookup );

            if ( runtimeTools.toolNames.length !== ( step.tools ?? [] ).length ) {
                throw new ResourceError( { message: `Missing tools for step ${ step.id }.` } );
            }

            const prompt = buildStepPrompt( {
                userMessage: params.userMessage
                , step
                , upstreamOutputs
                , toolNames: runtimeTools.toolNames
            } );

            const result = await generateText( {
                model: getModelProvider( params.modelId )
                , prompt
                , maxOutputTokens: 1200
                , temperature: 0.2
                , tools: Object.keys( runtimeTools.tools ).length > 0 ? runtimeTools.tools : undefined
                , toolChoice: Object.keys( runtimeTools.tools ).length > 0 ? 'auto' : undefined
            } );

            const output = result.text.trim();
            outputs[ step.id ] = output;

            const completedAt = new Date().toISOString();

            const updateStepRunResult = await updateStepRun( {
                workflowRunId
                , stepId: step.id
                , status: 'PASSED'
                , output
                , toolCalls: result.toolCalls ?? null
                , logs: result.toolResults ?? null
                , completedAt
            } );

            if ( updateStepRunResult.isError() ) {
                throw updateStepRunResult.value;
            }

            activeStepId = null;
        }
    } catch ( err ) {
        const completedAt = new Date().toISOString();

        if ( activeStepId ) {
            await updateStepRun( {
                workflowRunId
                , stepId: activeStepId
                , status: 'FAILED'
                , errorMessage: err instanceof Error ? err.message : 'Workflow step failed.'
                , completedAt
            } );
        }

        await updateWorkflowRunStatus( {
            workflowRunId
            , status: 'FAILED'
            , completedAt
        } );

        return error( new ResourceError( { message: 'Workflow execution failed.', error: err } ) );
    }

    const completedAt = new Date().toISOString();
    const updateRunResult = await updateWorkflowRunStatus( {
        workflowRunId
        , status: 'PASSED'
        , completedAt
    } );

    if ( updateRunResult.isError() ) {
        return error( updateRunResult.value );
    }

    const finalStepId = orderedSteps.length > 0 ? orderedSteps[ orderedSteps.length - 1 ].id : null;
    const finalOutput = finalStepId ? outputs[ finalStepId ] ?? '' : '';

    return success( {
        workflowRunId
        , content: finalOutput
    } );
};
