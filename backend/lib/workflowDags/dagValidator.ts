import {
    Either
    , error
    , success
} from '../../types';
import { WorkflowDagValidationFailed } from './workflowDags.errors';
import {
    WorkflowDAG
    , WorkflowToolRef
} from './workflowDags.types';

const normalizeToolKey = ( tool: WorkflowToolRef ) => {
    const id = tool.id;
    const version = tool.version ?? '';
    return `${ id }::${ version }`;
};

const buildToolLookup = ( tools: WorkflowToolRef[] ) => {
    const lookup = new Set<string>();

    tools.forEach( tool => {
        lookup.add( normalizeToolKey( tool ) );
        lookup.add( `${ tool.id }::` );
    } );

    return lookup;
};

const findDuplicateIds = ( ids: string[] ) => {
    const seen = new Set<string>();
    const duplicates = new Set<string>();

    ids.forEach( id => {
        if ( seen.has( id ) ) {
            duplicates.add( id );
        }
        seen.add( id );
    } );

    return Array.from( duplicates );
};

const hasCycle = ( dag: WorkflowDAG ): boolean => {
    const adjacency = new Map<string, string[]>();
    const visiting = new Set<string>();
    const visited = new Set<string>();

    dag.steps.forEach( step => {
        adjacency.set( step.id, step.dependsOn ?? [] );
    } );

    const visit = ( node: string ): boolean => {
        if ( visiting.has( node ) ) {
            return true;
        }
        if ( visited.has( node ) ) {
            return false;
        }

        visiting.add( node );

        const deps = adjacency.get( node ) ?? [];
        for ( const dep of deps ) {
            if ( visit( dep ) ) {
                return true;
            }
        }

        visiting.delete( node );
        visited.add( node );
        return false;
    };

    for ( const step of dag.steps ) {
        if ( visit( step.id ) ) {
            return true;
        }
    }

    return false;
};

/**
 * validate a workflow DAG for structural correctness
 *
 * @param params - validation parameters
 * @returns Either<ResourceError, void> - success or error
 */
export const validateWorkflowDag = (
    params: {
        dag: WorkflowDAG;
        validTools?: WorkflowToolRef[];
    }
): Either<WorkflowDagValidationFailed, void> => {

    // check for empty dag
    if ( !params.dag || !Array.isArray( params.dag.steps ) ) {
        return error( new WorkflowDagValidationFailed( 'Workflow DAG is missing steps.' ) );
    }

    // check for duplicate step ids
    const stepIds = params.dag.steps.map( step => step.id );
    const duplicateIds = findDuplicateIds( stepIds );

    if ( duplicateIds.length > 0 ) {
        return error( new WorkflowDagValidationFailed( `Duplicate step ids found: ${ duplicateIds.join( ', ' ) }.` ) );
    }

    // check for missing dependencies
    const stepIdSet = new Set( stepIds );

    for ( const step of params.dag.steps ) {
        const dependsOn = step.dependsOn ?? [];
        for ( const dependency of dependsOn ) {
            if ( !stepIdSet.has( dependency ) ) {
                return error( new WorkflowDagValidationFailed( `Missing dependency: ${ dependency }.` ) );
            }
        }
    }

    // check for cycles
    if ( hasCycle( params.dag ) ) {
        return error( new WorkflowDagValidationFailed( 'Workflow DAG contains a cycle.' ) );
    }

    // check tool references if provided
    if ( params.validTools && params.validTools.length > 0 ) {
        const toolLookup = buildToolLookup( params.validTools );

        for ( const step of params.dag.steps ) {
            const tools = step.tools ?? [];
            for ( const tool of tools ) {
                const toolKey = normalizeToolKey( tool );
                if ( !toolLookup.has( toolKey ) ) {
                    return error( new WorkflowDagValidationFailed( `Tool not found: ${ tool.id }.` ) );
                }
            }
        }
    }

    // return success
    return success( undefined );

};
