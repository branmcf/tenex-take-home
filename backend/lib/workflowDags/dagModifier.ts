import {
    Either
    , error
    , success
} from '../../types';
import {
    WorkflowDagModificationFailed
} from './workflowDags.errors';
import {
    WorkflowDAG
    , WorkflowStep
    , WorkflowToolRef
    , LLMToolCall
} from './workflowDags.types';
import { validateWorkflowDag } from './dagValidator';

const cloneDag = ( dag: WorkflowDAG ): WorkflowDAG => ( {
    steps: dag.steps.map( step => ( {
        id: step.id
        , name: step.name
        , instruction: step.instruction
        , tools: step.tools ? step.tools.map( tool => ( {
            id: tool.id
            , name: tool.name
            , version: tool.version
        } ) ) : []
        , dependsOn: step.dependsOn ? [ ...step.dependsOn ] : []
    } ) )
} );

const buildToolLookup = ( tools: WorkflowToolRef[] ) => {
    const lookup = new Map<string, WorkflowToolRef>();

    tools.forEach( tool => {
        const key = `${ tool.id }::${ tool.version ?? '' }`;
        lookup.set( key, tool );
        lookup.set( `${ tool.id }::`, tool );
    } );

    return lookup;
};

const resolveToolRefs = (
    tools: Array<{ id: string; version: string }> | undefined
    , availableTools: WorkflowToolRef[]
): WorkflowToolRef[] => {

    const toolLookup = buildToolLookup( availableTools );

    return ( tools ?? [] ).map( toolInput => {
        const lookupKey = `${ toolInput.id }::${ toolInput.version ?? '' }`;
        const resolved = toolLookup.get( lookupKey ) ?? toolLookup.get( `${ toolInput.id }::` );

        return {
            id: toolInput.id
            , name: resolved?.name ?? toolInput.id
            , version: toolInput.version
        };
    } );

};

const resolveStepId = ( id: string, tempIdMap: Map<string, string> ) => {
    return tempIdMap.get( id ) ?? id;
};

const getLastStepId = ( steps: WorkflowStep[] ) => {
    if ( steps.length === 0 ) {
        return undefined;
    }

    return steps[ steps.length - 1 ].id;
};

/**
 * apply LLM tool calls to a workflow DAG
 *
 * @param params - tool call parameters
 * @returns Either<ResourceError, WorkflowDAG> - updated DAG or error
 */
export const applyToolCallsToDag = (
    params: {
        dag: WorkflowDAG;
        toolCalls: LLMToolCall[];
        availableTools: WorkflowToolRef[];
        idGenerator: () => string;
    }
): Either<WorkflowDagModificationFailed, WorkflowDAG> => {

    // clone the dag to avoid mutating original
    const updatedDag = cloneDag( params.dag );

    // map temporary ids to real ids
    const tempIdMap = new Map<string, string>();

    // iterate over tool calls in order
    for ( const toolCall of params.toolCalls ) {
        if ( toolCall.name === 'add_step' ) {

            // generate a new step id
            const generatedId = params.idGenerator();

            // store mapping for temp id if provided
            if ( toolCall.args.tempId ) {
                tempIdMap.set( toolCall.args.tempId, generatedId );
            }

            // resolve dependencies
            let dependsOn = toolCall.args.dependsOn?.map( id => resolveStepId( id, tempIdMap ) ) ?? [];

            // apply positional helpers if no dependsOn provided
            if ( dependsOn.length === 0 && toolCall.args.position ) {
                if ( toolCall.args.position === 'start' ) {
                    dependsOn = [];
                }

                if ( toolCall.args.position === 'end' ) {
                    const lastStepId = getLastStepId( updatedDag.steps );
                    dependsOn = lastStepId ? [ lastStepId ] : [];
                }

                if ( toolCall.args.position === 'after' && toolCall.args.afterStepId ) {
                    dependsOn = [ resolveStepId( toolCall.args.afterStepId, tempIdMap ) ];
                }
            }

            // resolve tool references
            const resolvedTools = resolveToolRefs( toolCall.args.tools, params.availableTools );

            // add the new step
            updatedDag.steps.push( {
                id: generatedId
                , name: toolCall.args.name
                , instruction: toolCall.args.instruction
                , tools: resolvedTools
                , dependsOn
            } );
        }

        if ( toolCall.name === 'update_step' ) {
            const resolvedStepId = resolveStepId( toolCall.args.stepId, tempIdMap );

            // find the step to update
            const step = updatedDag.steps.find( existingStep => existingStep.id === resolvedStepId );
            if ( !step ) {
                return error( new WorkflowDagModificationFailed( `Step not found: ${ resolvedStepId }.` ) );
            }

            // update basic fields
            if ( toolCall.args.name ) {
                step.name = toolCall.args.name;
            }
            if ( toolCall.args.instruction ) {
                step.instruction = toolCall.args.instruction;
            }

            // replace tools if provided
            if ( toolCall.args.tools ) {
                step.tools = resolveToolRefs( toolCall.args.tools, params.availableTools );
            }

            // append tools if provided
            if ( toolCall.args.addTools ) {
                const existingTools = step.tools ?? [];
                const newTools = resolveToolRefs( toolCall.args.addTools, params.availableTools );
                step.tools = [ ...existingTools, ...newTools ];
            }

            // remove tools if provided
            if ( toolCall.args.removeTools ) {
                const removeIds = toolCall.args.removeTools.map( tool => tool.id );
                step.tools = ( step.tools ?? [] ).filter( tool => !removeIds.includes( tool.id ) );
            }

            // update dependencies if provided
            if ( toolCall.args.dependsOn ) {
                step.dependsOn = toolCall.args.dependsOn.map( id => resolveStepId( id, tempIdMap ) );
            }
        }

        if ( toolCall.name === 'delete_step' ) {
            const resolvedStepId = resolveStepId( toolCall.args.stepId, tempIdMap );

            // find the step to delete
            const deleteIndex = updatedDag.steps.findIndex( step => step.id === resolvedStepId );
            if ( deleteIndex < 0 ) {
                return error( new WorkflowDagModificationFailed( `Step not found: ${ resolvedStepId }.` ) );
            }

            // capture dependencies for rewire
            const deletedStep = updatedDag.steps[ deleteIndex ];
            const deletedDependsOn = deletedStep.dependsOn ?? [];

            // remove the step from the dag
            updatedDag.steps.splice( deleteIndex, 1 );

            // update dependencies in remaining steps
            for ( const step of updatedDag.steps ) {
                const dependsOn = step.dependsOn ?? [];

                if ( dependsOn.includes( resolvedStepId ) ) {
                    const remainingDependsOn = dependsOn.filter( dep => dep !== resolvedStepId );

                    if ( toolCall.args.rewireStrategy === 'manual' && toolCall.args.rewireToStepId ) {
                        remainingDependsOn.push( resolveStepId( toolCall.args.rewireToStepId, tempIdMap ) );
                    } else {
                        deletedDependsOn.forEach( dep => {
                            if ( !remainingDependsOn.includes( dep ) ) {
                                remainingDependsOn.push( dep );
                            }
                        } );
                    }

                    step.dependsOn = remainingDependsOn;
                }
            }
        }

        if ( toolCall.name === 'reorder_steps' ) {
            const resolvedStepId = resolveStepId( toolCall.args.stepId, tempIdMap );

            // find the step to update
            const step = updatedDag.steps.find( existingStep => existingStep.id === resolvedStepId );
            if ( !step ) {
                return error( new WorkflowDagModificationFailed( `Step not found: ${ resolvedStepId }.` ) );
            }

            // update dependencies
            step.dependsOn = toolCall.args.newDependsOn.map( id => resolveStepId( id, tempIdMap ) );
        }
    }

    // validate the updated dag
    const validationResult = validateWorkflowDag( {
        dag: updatedDag
        , validTools: params.availableTools
    } );

    if ( validationResult.isError() ) {
        return error( new WorkflowDagModificationFailed( validationResult.value.message ) );
    }

    // return the updated dag
    return success( updatedDag );

};
