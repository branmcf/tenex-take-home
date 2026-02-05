import {
    tool
    , jsonSchema
} from 'ai';

const emptyOutputSchema = jsonSchema( {
    type: 'object'
    , properties: {}
    , additionalProperties: false
} );

const toolRefSchema = {
    type: 'object'
    , properties: {
        id: { type: 'string' }
        , version: { type: 'string' }
    }
    , required: [ 'id', 'version' ]
    , additionalProperties: false
};

const addStepInputSchema = jsonSchema( {
    type: 'object'
    , properties: {
        tempId: { type: 'string' }
        , name: { type: 'string' }
        , instruction: { type: 'string' }
        , tools: {
            type: 'array'
            , items: toolRefSchema
        }
        , dependsOn: {
            type: 'array'
            , items: { type: 'string' }
        }
        , position: { type: 'string', enum: [ 'start', 'end', 'after' ] }
        , afterStepId: { type: 'string' }
    }
    , required: [ 'name', 'instruction' ]
    , additionalProperties: false
} );

const updateStepInputSchema = jsonSchema( {
    type: 'object'
    , properties: {
        stepId: { type: 'string' }
        , name: { type: 'string' }
        , instruction: { type: 'string' }
        , tools: { type: 'array', items: toolRefSchema }
        , addTools: { type: 'array', items: toolRefSchema }
        , removeTools: { type: 'array', items: toolRefSchema }
        , dependsOn: { type: 'array', items: { type: 'string' } }
    }
    , required: [ 'stepId' ]
    , additionalProperties: false
} );

const deleteStepInputSchema = jsonSchema( {
    type: 'object'
    , properties: {
        stepId: { type: 'string' }
        , rewireStrategy: { type: 'string', enum: [ 'auto', 'manual' ] }
        , rewireToStepId: { type: 'string' }
    }
    , required: [ 'stepId' ]
    , additionalProperties: false
} );

const reorderStepsInputSchema = jsonSchema( {
    type: 'object'
    , properties: {
        stepId: { type: 'string' }
        , newDependsOn: { type: 'array', items: { type: 'string' } }
    }
    , required: [ 'stepId', 'newDependsOn' ]
    , additionalProperties: false
} );

export const workflowTools = {
    add_step: tool( {
        description: 'Add a new workflow step to the DAG.'
        , inputSchema: addStepInputSchema
        , outputSchema: emptyOutputSchema
    } )
    , update_step: tool( {
        description: 'Update an existing workflow step in the DAG.'
        , inputSchema: updateStepInputSchema
        , outputSchema: emptyOutputSchema
    } )
    , delete_step: tool( {
        description: 'Delete a workflow step from the DAG.'
        , inputSchema: deleteStepInputSchema
        , outputSchema: emptyOutputSchema
    } )
    , reorder_steps: tool( {
        description: 'Change dependencies for a workflow step.'
        , inputSchema: reorderStepsInputSchema
        , outputSchema: emptyOutputSchema
    } )
};
