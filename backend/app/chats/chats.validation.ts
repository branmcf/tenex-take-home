import Joi from 'joi';

export const GET_USER_CHATS = Joi.object( {
    params: Joi.object( {
        userId: Joi.string()
            .trim()
            .min( 1 )
            .required()
    } )
        .required()
        .options( { presence: 'required' } )
    , query: Joi.object( {
        limit: Joi.number()
            .integer()
            .positive()
            .max( 100 )
            .optional()
        , offset: Joi.number()
            .integer()
            .min( 0 )
            .optional()
    } )
        .optional()
} );

export const DELETE_CHAT = Joi.object( {
    params: Joi.object( {
        chatId: Joi.string()
            .trim()
            .uuid()
            .required()
    } )
        .required()
        .options( { presence: 'required' } )
} );
