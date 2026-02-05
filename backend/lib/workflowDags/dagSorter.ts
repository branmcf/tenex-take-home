import {
    WorkflowDAG
    , WorkflowStep
} from './workflowDags.types';

const buildStepOrderLookup = ( steps: WorkflowStep[] ) => {
    const orderLookup = new Map<string, number>();

    steps.forEach( ( step, index ) => {
        orderLookup.set( step.id, index );
    } );

    return orderLookup;
};

const buildDependencyMaps = ( steps: WorkflowStep[] ) => {
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

    return { stepMap, indegree, dependents };
};

const sortQueueByOriginalOrder = ( queue: WorkflowStep[], orderLookup: Map<string, number> ) => {
    queue.sort( ( left, right ) => {
        return ( orderLookup.get( left.id ) ?? 0 ) - ( orderLookup.get( right.id ) ?? 0 );
    } );
};

/**
 * sort workflow steps in a stable topological order
 *
 * @param steps - workflow steps to sort
 * @returns WorkflowStep[] - ordered steps
 */
export const sortWorkflowDagSteps = ( steps: WorkflowStep[] ): WorkflowStep[] => {

    // return early if there are no steps
    if ( !Array.isArray( steps ) || steps.length === 0 ) {
        return [];
    }

    // build lookup helpers for stable ordering
    const orderLookup = buildStepOrderLookup( steps );

    // build dependency maps
    const { stepMap, indegree, dependents } = buildDependencyMaps( steps );

    // seed the queue with steps that have no dependencies
    const queue: WorkflowStep[] = [];
    steps.forEach( step => {
        if ( ( indegree.get( step.id ) ?? 0 ) === 0 ) {
            queue.push( step );
        }
    } );

    // keep queue stable based on original order
    sortQueueByOriginalOrder( queue, orderLookup );

    // walk the graph in topological order
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
                    sortQueueByOriginalOrder( queue, orderLookup );
                }
            }
        } );
    }

    // fall back to original order if we could not sort every step
    if ( sorted.length !== steps.length ) {
        const sortedIds = new Set( sorted.map( step => step.id ) );
        steps.forEach( step => {
            if ( !sortedIds.has( step.id ) ) {
                sorted.push( step );
            }
        } );
    }

    // return ordered steps
    return sorted;

};

/**
 * return a dag with steps sorted in topological order
 *
 * @param dag - workflow dag to sort
 * @returns WorkflowDAG - ordered dag
 */
export const sortWorkflowDag = ( dag: WorkflowDAG ): WorkflowDAG => {
    return {
        ...dag
        , steps: sortWorkflowDagSteps( dag.steps ?? [] )
    };
};
