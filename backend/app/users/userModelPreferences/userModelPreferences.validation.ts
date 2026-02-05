import Joi from 'joi';

export const GET_USER_MODEL_PREFERENCE = Joi.object( {
    params: Joi.object( {
        userId: Joi.string()
            .trim()
            .min( 1 )
            .required()
    } )
        .required()
        .options( { presence: 'required' } )
} );

export const UPDATE_USER_MODEL_PREFERENCE = Joi.object( {
    params: Joi.object( {
        userId: Joi.string()
            .trim()
            .min( 1 )
            .required()
    } )
        .required()
        .options( { presence: 'required' } )
    , body: Joi.object( {
        modelId: Joi.string()
            .trim()
            .min( 1 )
            .required()
    } )
        .required()
        .options( { presence: 'required' } )
} );
