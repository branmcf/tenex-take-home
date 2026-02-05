import {
    Either
    , error
    , success
} from '../../../types';
import { ResourceError } from '../../../errors';
import {
    getUserModelPreferenceByUserId
    , createUserModelPreference
    , updateUserModelPreferenceById
} from './userModelPreferences.service';
import {
    UserModelPreferenceRecord
} from './userModelPreferences.types';
import {
    UserModelPreferenceUpdateFailed
} from './userModelPreferences.errors';

/**
 * create or update a user model preference
 *
 * @param userId - user id
 * @param modelId - model id
 * @returns Either<ResourceError, UserModelPreferenceRecord>
 */
export const upsertUserModelPreference = async (
    userId: string
    , modelId: string
): Promise<Either<ResourceError, UserModelPreferenceRecord>> => {

    const existingResult = await getUserModelPreferenceByUserId( userId );

    if ( existingResult.isError() ) {
        return error( existingResult.value );
    }

    if ( existingResult.value ) {
        const updateResult = await updateUserModelPreferenceById( existingResult.value.id, modelId );

        if ( updateResult.isError() ) {
            return error( updateResult.value );
        }

        return success( updateResult.value );
    }

    const createResult = await createUserModelPreference( userId, modelId );

    if ( createResult.isError() ) {
        return error( createResult.value );
    }

    if ( !createResult.value ) {
        return error( new UserModelPreferenceUpdateFailed() );
    }

    return success( createResult.value );

};
