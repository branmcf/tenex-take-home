import express from 'express';
import {
    requestHandlerErrorWrapper
    , requestValidator
    , userIdValidator
} from '../../../middleware';
import {
    getUserModelPreferenceHandler
    , updateUserModelPreferenceHandler
} from './userModelPreferences.ctrl';

// create an express router
export const userModelPreferencesRouter = express.Router( { mergeParams: true } );

// define the routes of the express router
userModelPreferencesRouter
    .get(
        '/:userId/model-preference'
        , requestValidator( 'GET_USER_MODEL_PREFERENCE' )
        , userIdValidator
        , requestHandlerErrorWrapper( getUserModelPreferenceHandler )
    )
    .post(
        '/:userId/model-preference'
        , requestValidator( 'UPDATE_USER_MODEL_PREFERENCE' )
        , userIdValidator
        , requestHandlerErrorWrapper( updateUserModelPreferenceHandler )
    );
