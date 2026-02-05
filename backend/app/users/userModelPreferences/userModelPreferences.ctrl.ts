import { Response } from 'express';
import { ResourceError } from '../../../errors';
import {
    getUserModelPreferenceByUserId
} from './userModelPreferences.service';
import {
    upsertUserModelPreference
} from './userModelPreferences.helper';
import {
    GetUserModelPreferenceRequest
    , GetUserModelPreferenceResponse
    , UpdateUserModelPreferenceRequest
    , UpdateUserModelPreferenceResponse
} from './userModelPreferences.types';

/**
 * @title Get User Model Preference Handler
 * @notice Returns the user's last selected model (if any).
 * @param req Express request
 * @param res Express response
 */
export const getUserModelPreferenceHandler = async (
    req: GetUserModelPreferenceRequest
    , res: Response<ResourceError | GetUserModelPreferenceResponse>
): Promise<Response<ResourceError | GetUserModelPreferenceResponse>> => {

    // get userId from params
    const { userId } = req.params;

    // fetch existing preference
    const preferenceResult = await getUserModelPreferenceByUserId( userId );

    // check for errors
    if ( preferenceResult.isError() ) {
        return res
            .status( preferenceResult.value.statusCode )
            .json( preferenceResult.value );
    }

    // map to response format
    const modelId = preferenceResult.value?.modelId ?? null;

    // return success
    return res.status( 200 ).json( { modelId } );

};

/**
 * @title Update User Model Preference Handler
 * @notice Stores the user's last selected model.
 * @param req Express request
 * @param res Express response
 */
export const updateUserModelPreferenceHandler = async (
    req: UpdateUserModelPreferenceRequest
    , res: Response<ResourceError | UpdateUserModelPreferenceResponse>
): Promise<Response<ResourceError | UpdateUserModelPreferenceResponse>> => {

    // get params and body
    const { userId } = req.params;
    const { modelId } = req.body;

    // upsert preference
    const updateResult = await upsertUserModelPreference( userId, modelId );

    // check for errors
    if ( updateResult.isError() ) {
        return res
            .status( updateResult.value.statusCode )
            .json( updateResult.value );
    }

    // return success
    return res.status( 200 ).json( {
        success: true
        , modelId: updateResult.value.modelId
    } );

};
