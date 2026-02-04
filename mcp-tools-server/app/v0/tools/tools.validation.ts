import Joi from 'joi';

export const MCP_REQUEST = Joi.object( {
    body: Joi.object( {
        method: Joi.string()
            .valid( 'listTools', 'searchTools', 'getTool', 'runTool' )
            .required()
        , params: Joi.object().required()
    } )
        .required()
        .options( { presence: 'required' } )
} );
