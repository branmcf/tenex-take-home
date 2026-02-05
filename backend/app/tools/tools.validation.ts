import Joi from 'joi';

export const GET_TOOLS = Joi.object( {
    query: Joi.object( {
        refresh: Joi.string().trim().optional()
    } )
        .optional()
} );

export const SEARCH_TOOLS = Joi.object( {
    query: Joi.object( {
        q: Joi.string()
            .trim()
            .min( 1 )
            .required()
    } )
        .required()
        .options( { presence: 'required' } )
} );

export const GET_TOOL_BY_ID = Joi.object( {
    params: Joi.object( {
        toolId: Joi.string()
            .trim()
            .min( 1 )
            .required()
    } )
        .required()
        .options( { presence: 'required' } )
} );
