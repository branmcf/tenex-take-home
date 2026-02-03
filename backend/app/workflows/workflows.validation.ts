import Joi from 'joi';

export const GET_USER_WORKFLOWS = Joi.object( {
    params: Joi.object( {
        userId: Joi.string()
            .trim()
            .min( 1 )
            .required()
    } )
        .required()
        .options( { presence: 'required' } )
} );

export const GET_WORKFLOW_BY_ID = Joi.object( {
    params: Joi.object( {
        workflowId: Joi.string()
            .trim()
            .uuid()
            .required()
    } )
        .required()
        .options( { presence: 'required' } )
} );

export const CREATE_WORKFLOW = Joi.object( {
    body: Joi.object( {
        userId: Joi.string()
            .trim()
            .min( 1 )
            .required()
        , name: Joi.string()
            .trim()
            .min( 1 )
            .max( 255 )
            .required()
        , description: Joi.string()
            .trim()
            .max( 1000 )
            .allow( '' )
            .optional()
    } )
        .required()
        .options( { presence: 'required' } )
} );

export const UPDATE_WORKFLOW = Joi.object( {
    params: Joi.object( {
        workflowId: Joi.string()
            .trim()
            .uuid()
            .required()
    } )
        .required()
        .options( { presence: 'required' } )
    , body: Joi.object( {
        name: Joi.string()
            .trim()
            .min( 1 )
            .max( 255 )
            .optional()
        , description: Joi.string()
            .trim()
            .max( 1000 )
            .allow( '' )
            .optional()
    } )
        .required()
        .or( 'name', 'description' )
} );

export const DELETE_WORKFLOW = Joi.object( {
    params: Joi.object( {
        workflowId: Joi.string()
            .trim()
            .uuid()
            .required()
    } )
        .required()
        .options( { presence: 'required' } )
} );
