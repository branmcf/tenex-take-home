import Joi from 'joi';

export const CREATE_MESSAGE = Joi.object( {
    params: Joi.object( {
        chatId: Joi.string()
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
        , userId: Joi.string()
            .trim()
            .min( 1 )
            .required()
    } )
        .required()
        .options( { presence: 'required' } )
} );

export const GET_MESSAGES_BY_CHAT_ID = Joi.object( {
    params: Joi.object( {
        chatId: Joi.string()
            .trim()
            .uuid()
            .required()
    } )
        .required()
        .options( { presence: 'required' } )
} );
