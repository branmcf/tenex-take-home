import Joi from 'joi';

export const GET_WORKFLOW_CHAT_MESSAGES = Joi.object( {
    params: Joi.object( {
        workflowId: Joi.string()
            .trim()
            .uuid()
            .required()
    } )
        .required()
        .options( { presence: 'required' } )
} );

export const CREATE_WORKFLOW_CHAT_MESSAGE = Joi.object( {
    params: Joi.object( {
        workflowId: Joi.string()
            .trim()
            .uuid()
            .required()
    } )
        .required()
        .options( { presence: 'required' } )
    , body: Joi.object( {
        content: Joi.string()
            .trim()
            .min( 1 )
            .required()
        , modelId: Joi.string()
            .trim()
            .min( 1 )
            .required()
    } )
        .required()
        .options( { presence: 'required' } )
} );
