import Joi from 'joi';

export const STREAM_WORKFLOW_RUN = Joi.object( {
    params: Joi.object( {
        chatId: Joi.string()
            .trim()
            .uuid()
            .required()
        , workflowRunId: Joi.string()
            .trim()
            .uuid()
            .required()
    } )
        .required()
        .options( { presence: 'required' } )
} );

export const GET_WORKFLOW_RUNS = Joi.object( {
    params: Joi.object( {
        chatId: Joi.string()
            .trim()
            .uuid()
            .required()
    } )
        .required()
        .options( { presence: 'required' } )
} );
