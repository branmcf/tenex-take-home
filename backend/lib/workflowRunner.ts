/* eslint-disable @typescript-eslint/no-explicit-any */
import { gql } from 'graphile-utils';
import {
    generateText, tool, jsonSchema
} from 'ai';
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
import { buildWorkflowStepExecutionPrompt } from '../utils/constants';

interface WorkflowRunResult {
    workflowRunId: string;
    content: string;
}

interface WorkflowRunCallbacks {
    onRunCreated?: ( workflowRunId: string ) => void;
}

interface WorkflowToolLogEntry {
    toolName: string;
    input: Record<string, unknown>;
    output?: unknown;
    error?: string;
    errorCode?: string;
    errorDetails?: unknown;
    status: 'RUNNING' | 'PASSED' | 'FAILED';
    startedAt: string;
    completedAt?: string;
    toolCallId?: string | null;
}

interface ToolExecutionSummary {
    total: number;
    passed: number;
    failed: number;
    failedTools: string[];
}

/**
 * @notice Build a lookup key from a tool reference.
 * @param tool - workflow tool reference
 * @returns tool key used for lookups
 */
const buildToolKey = ( tool: WorkflowToolRef ) => {
    return `${ tool.id }::${ tool.version ?? '' }`;
};

/**
 * @notice Build a lookup of MCP tools by id + version.
 * @param tools - cached MCP tools
 * @returns map of tool key -> tool record
 */
const buildToolRecordLookup = ( tools: MCPTool[] ) => {
    const lookup = new Map<string, MCPTool>();

    tools.forEach( toolRecord => {
        const key = `${ toolRecord.id }::${ toolRecord.version ?? '' }`;
        lookup.set( key, toolRecord );
        lookup.set( `${ toolRecord.id }::`, toolRecord );
    } );

    return lookup;
};

/**
 * @notice Normalize cached tool records into MCP tool shape.
 * @param tools - cached tool records
 * @returns MCP tool records
 */
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

/**
 * @notice Find tool references that are missing from the lookup.
 * @param toolRefs - tool references required by the dag
 * @param lookup - MCP tool lookup
 * @returns missing tool references
 */
const findMissingToolRefs = ( toolRefs: WorkflowToolRef[], lookup: Map<string, MCPTool> ) => {
    return toolRefs.filter( toolRef => {
        const lookupKey = buildToolKey( toolRef );
        return !lookup.has( lookupKey ) && !lookup.has( `${ toolRef.id }::` );
    } );
};


/**
 * @notice Topologically sort steps so dependencies come first.
 * @param steps - workflow steps
 * @returns sorted steps
 */
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

    // start with all steps that have no incoming edges
    const queue: WorkflowStep[] = [];
    steps.forEach( step => {
        if ( ( indegree.get( step.id ) ?? 0 ) === 0 ) {
            queue.push( step );
        }
    } );

    // repeatedly peel off ready steps
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

/**
 * @notice Create a workflow run record in the database.
 * @param params - workflow run creation params
 * @returns workflow run id
 */
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

/**
 * @notice Update the overall workflow run status.
 * @param params - status update parameters
 * @returns success or error
 */
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

/**
 * @notice Create a step run record for a workflow run.
 * @param params - step run creation params
 * @returns success or error
 */
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

/**
 * @notice Update a step run with output, logs, or errors.
 * @param params - step run update params
 * @returns success or error
 */
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

/**
 * @notice Build runtime tool wrappers for a single step.
 * Tool failures do NOT throw - they return error information that the LLM can process.
 * This allows the step to continue and potentially produce useful output despite tool failures.
 * @param stepTools - tool refs from the step
 * @param toolLookup - cached tool lookup
 * @param toolLogs - array to append tool execution logs into
 * @returns tool definitions + tool names
 */
const buildRuntimeTools = (
    stepTools: WorkflowToolRef[]
    , toolLookup: Map<string, MCPTool>
    , toolLogs: WorkflowToolLogEntry[]
) => {

    const tools: Record<string, ReturnType<typeof tool<any, any>>> = {};
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
                const startedAt = new Date().toISOString();
                const logEntry: WorkflowToolLogEntry = {
                    toolName
                    , input
                    , status: 'RUNNING'
                    , startedAt
                };

                toolLogs.push( logEntry );

                const runResult = await runMcpTool( {
                    id: toolRecord.id
                    , version: toolRecord.version
                    , input
                } );

                if ( runResult.isError() ) {
                    const errorValue = runResult.value;
                    logEntry.status = 'FAILED';
                    logEntry.error = errorValue.message ?? 'Tool execution failed.';
                    logEntry.errorCode = errorValue.code;
                    logEntry.errorDetails = errorValue.error;
                    logEntry.completedAt = new Date().toISOString();

                    // Return error info instead of throwing - let the LLM handle it
                    return {
                        error: true
                        , message: errorValue.message ?? 'Tool execution failed.'
                        , code: errorValue.code
                        , toolName
                    };
                }

                logEntry.status = 'PASSED';
                logEntry.output = runResult.value.output;
                logEntry.completedAt = new Date().toISOString();

                return runResult.value.output;
            }
        } );
    } );

    return {
        tools
        , toolNames
    };
};

/**
 * @notice Summarize tool execution results from logs.
 * @param toolLogs - tool execution log entries
 * @returns summary of tool execution
 */
const summarizeToolExecution = ( toolLogs: WorkflowToolLogEntry[] ): ToolExecutionSummary => {
    const passed = toolLogs.filter( log => log.status === 'PASSED' ).length;
    const failed = toolLogs.filter( log => log.status === 'FAILED' ).length;
    const failedTools = toolLogs
        .filter( log => log.status === 'FAILED' )
        .map( log => log.toolName );

    return {
        total: toolLogs.length
        , passed
        , failed
        , failedTools
    };
};

/**
 * Minimum output length to consider a step as having produced meaningful output.
 * Short outputs like "Error" or empty strings indicate the step failed to provide data.
 */
const MIN_MEANINGFUL_OUTPUT_LENGTH = 20;

/**
 * Patterns that indicate the output is just an error message, not useful data.
 */
const ERROR_OUTPUT_PATTERNS = [
    /^(error|failed|unable to|cannot|could not|i('m| am) (sorry|unable))/i
    , /^(unfortunately|i apologize)/i
    , /tool (call|execution) failed/i
    , /no (data|results|information|output) (available|found|returned)/i
];

interface StepSuccessEvaluation {
    success: boolean;
    reason: string;
    toolSummary: ToolExecutionSummary;
}

/**
 * @notice Evaluate whether a step produced sufficient output for downstream steps.
 * A step fails if it cannot provide meaningful data to the next step, not just because tools failed.
 * @param output - the step's output text
 * @param toolSummary - summary of tool execution results
 * @param hasDownstreamSteps - whether this step has dependent steps
 * @returns evaluation result with success flag and reason
 */
const evaluateStepSuccess = (
    output: string
    , toolSummary: ToolExecutionSummary
    , hasDownstreamSteps: boolean
): StepSuccessEvaluation => {

    const trimmedOutput = output.trim();

    // Check if output is empty or too short
    if ( trimmedOutput.length === 0 ) {
        return {
            success: false
            , reason: 'Step produced no output.'
            , toolSummary
        };
    }

    // If this step feeds into other steps, be stricter about output quality
    if ( hasDownstreamSteps ) {
        // Check for minimum meaningful length
        if ( trimmedOutput.length < MIN_MEANINGFUL_OUTPUT_LENGTH ) {
            return {
                success: false
                , reason: `Step output too short (${ trimmedOutput.length } chars) to provide meaningful data to downstream steps.`
                , toolSummary
            };
        }

        // Check if output is just an error message
        for ( const pattern of ERROR_OUTPUT_PATTERNS ) {
            if ( pattern.test( trimmedOutput ) ) {
                return {
                    success: false
                    , reason: `Step output appears to be an error message rather than useful data: "${ trimmedOutput.substring( 0, 100 ) }..."`
                    , toolSummary
                };
            }
        }
    }

    // If tools were used and ALL failed, but output is still meaningful, that's OK
    // The LLM might have reasoned about the failures and provided useful analysis
    if ( toolSummary.total > 0 && toolSummary.failed === toolSummary.total ) {
        // All tools failed - check if output is still useful
        // If the output is just reporting the failures, that's not useful
        const mentionsToolFailure = /tool.*fail|failed to (call|execute|run)/i.test( trimmedOutput );

        if ( mentionsToolFailure && trimmedOutput.length < 200 ) {
            return {
                success: false
                , reason: `All ${ toolSummary.total } tool(s) failed and step output only reports the failures.`
                , toolSummary
            };
        }
    }

    // Step produced meaningful output
    return {
        success: true
        , reason: toolSummary.failed > 0
            ? `Step succeeded despite ${ toolSummary.failed }/${ toolSummary.total } tool(s) failing.`
            : toolSummary.total > 0
                ? `Step succeeded with all ${ toolSummary.total } tool(s) passing.`
                : 'Step succeeded (no tools used).'
        , toolSummary
    };
};

/**
 * @notice Execute a workflow run end-to-end in topological order.
 * @param params - workflow run inputs
 * @returns workflow run result or error
 */
export const runWorkflow = async (
    params: {
        workflowId: string;
        chatId: string;
        triggerMessageId: string;
        userMessage: string;
        modelId: string;
        callbacks?: WorkflowRunCallbacks;
    }
): Promise<Either<ResourceError, WorkflowRunResult>> => {

    const workflowResult = await getWorkflowById( params.workflowId );

    if ( workflowResult.isError() ) {
        return error( workflowResult.value );
    }

    const workflow = workflowResult.value;
    const latestVersion = workflow.workflowVersionsByWorkflowId?.nodes?.[ 0 ];

    if ( !latestVersion?.dag ) {
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

    // notify listener that the workflow run was created
    if ( params.callbacks?.onRunCreated ) {
        try {
            params.callbacks.onRunCreated( workflowRunId );
        } catch ( err ) {
            // ignore callback errors to avoid breaking execution
            // eslint-disable-next-line no-console
            console.warn( 'workflow runner: onRunCreated callback failed', err );
        }
    }

    const outputs: Record<string, string> = {};

    // topologically order steps so dependencies run first
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

            // collect upstream outputs as context for this step
            const upstreamOutputs = ( step.dependsOn ?? [] )
                .map( depId => {
                    const output = outputs[ depId ] ?? '';
                    return `Output from ${ depId }:\n${ output }`;
                } )
                .filter( entry => entry.trim().length > 0 );

            const toolExecutionLogs: WorkflowToolLogEntry[] = [];

            const runtimeTools = buildRuntimeTools( step.tools ?? [], toolLookup, toolExecutionLogs );

            if ( runtimeTools.toolNames.length !== ( step.tools ?? [] ).length ) {
                throw new ResourceError( { message: `Missing tools for step ${ step.id }.` } );
            }

            // assemble the step prompt with context + tools
            const prompt = buildWorkflowStepExecutionPrompt( {
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

            // Get text output, or fallback to tool results if text is empty
            let output = result.text.trim();

            // If no text output but tools were called, extract output from successful tool results
            if ( !output && toolExecutionLogs.length > 0 ) {
                const successfulToolOutputs = toolExecutionLogs
                    .filter( log => log.status === 'PASSED' && log.output )
                    .map( log => {
                        const outputStr = typeof log.output === 'string'
                            ? log.output
                            : JSON.stringify( log.output, null, 2 );
                        return `[Tool: ${ log.toolName }]\n${ outputStr }`;
                    } );

                if ( successfulToolOutputs.length > 0 ) {
                    output = successfulToolOutputs.join( '\n\n' );
                }
            }

            outputs[ step.id ] = output;

            const completedAt = new Date().toISOString();

            // attach tool call ids to tool logs when available
            const toolCalls = Array.isArray( result.toolCalls )
                ? result.toolCalls
                : [];

            toolCalls.forEach( ( toolCall, index ) => {
                const logEntry = toolExecutionLogs[ index ];

                if ( !logEntry || !toolCall || typeof toolCall !== 'object' ) {
                    return;
                }

                const toolCallRecord = toolCall as { toolCallId?: string; toolName?: string };

                if ( toolCallRecord.toolCallId ) {
                    logEntry.toolCallId = toolCallRecord.toolCallId;
                }

                if ( toolCallRecord.toolName && !logEntry.toolName ) {
                    logEntry.toolName = toolCallRecord.toolName;
                }
            } );

            // Summarize tool execution and evaluate step success
            const toolSummary = summarizeToolExecution( toolExecutionLogs );
            const hasDownstreamSteps = orderedSteps.some(
                s => s.dependsOn?.includes( step.id )
            );
            const evaluation = evaluateStepSuccess( output, toolSummary, hasDownstreamSteps );

            // Build comprehensive step logs including tool execution and summary
            const stepLogs = {
                toolExecutions: toolExecutionLogs.length > 0 ? toolExecutionLogs : null
                , toolSummary: toolExecutionLogs.length > 0 ? toolSummary : null
                , evaluation: {
                    success: evaluation.success
                    , reason: evaluation.reason
                    , hasDownstreamSteps
                }
            };

            // If evaluation fails, the step fails
            if ( !evaluation.success ) {
                await updateStepRun( {
                    workflowRunId
                    , stepId: step.id
                    , status: 'FAILED'
                    , output
                    , errorMessage: evaluation.reason
                    , toolCalls: toolCalls.length > 0 ? toolCalls : null
                    , logs: stepLogs
                    , completedAt
                } );

                throw new ResourceError( {
                    message: `Step "${ step.name ?? step.id }" failed: ${ evaluation.reason }`
                } );
            }

            const updateStepRunResult = await updateStepRun( {
                workflowRunId
                , stepId: step.id
                , status: 'PASSED'
                , output
                , toolCalls: toolCalls.length > 0 ? toolCalls : null
                , logs: stepLogs
                , completedAt
            } );

            if ( updateStepRunResult.isError() ) {
                throw updateStepRunResult.value;
            }

            activeStepId = null;
        }
    } catch ( err ) {
        const completedAt = new Date().toISOString();

        // Check if step was already updated as FAILED (from evaluation failure)
        const alreadyUpdated = err instanceof ResourceError && err.message.startsWith( 'Step "' );

        if ( activeStepId && !alreadyUpdated ) {
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
