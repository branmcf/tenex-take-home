import { gql } from 'graphile-utils';
import {
    Either
    , error
    , success
} from '../../../types';
import { ResourceError } from '../../../errors';
import { postGraphileRequest } from '../../../lib/postGraphile';
import {
    UserModelPreferenceFetchFailed
    , UserModelPreferenceUpdateFailed
} from './userModelPreferences.errors';
import { UserModelPreferenceRecord } from './userModelPreferences.types';

interface UserModelPreferenceQueryResult {
    allUserModelPreferences?: {
        nodes: Array<UserModelPreferenceRecord | null>;
    } | null;
}

interface CreateUserModelPreferenceMutationResult {
    createUserModelPreference?: {
        userModelPreference?: UserModelPreferenceRecord | null;
    } | null;
}

interface UpdateUserModelPreferenceMutationResult {
    updateUserModelPreferenceById?: {
        userModelPreference?: UserModelPreferenceRecord | null;
    } | null;
}

/**
 * get a user model preference by user id
 *
 * @param userId - user id
 * @returns Either<ResourceError, UserModelPreferenceRecord | null>
 */
export const getUserModelPreferenceByUserId = async (
    userId: string
): Promise<Either<ResourceError, UserModelPreferenceRecord | null>> => {

    const GET_USER_MODEL_PREFERENCE = gql`
        query getUserModelPreference($userId: String!) {
            allUserModelPreferences(condition: { userId: $userId }) {
                nodes {
                    id
                    userId
                    modelId
                    createdAt
                    updatedAt
                }
            }
        }
    `;

    const result = await postGraphileRequest<UserModelPreferenceQueryResult, { userId: string }>( {
        query: GET_USER_MODEL_PREFERENCE
        , variables: { userId }
    } );

    if ( result.isError() ) {
        return error( new UserModelPreferenceFetchFailed() );
    }

    const nodes = result.value.allUserModelPreferences?.nodes ?? [];
    const preference = nodes.find( ( node ): node is UserModelPreferenceRecord => node !== null ) ?? null;

    return success( preference );

};

/**
 * create a user model preference
 *
 * @param userId - user id
 * @param modelId - model id
 * @returns Either<ResourceError, UserModelPreferenceRecord>
 */
export const createUserModelPreference = async (
    userId: string
    , modelId: string
): Promise<Either<ResourceError, UserModelPreferenceRecord>> => {

    const CREATE_USER_MODEL_PREFERENCE = gql`
        mutation createUserModelPreference($userId: String!, $modelId: String!) {
            createUserModelPreference(input: {
                userModelPreference: {
                    userId: $userId
                    modelId: $modelId
                }
            }) {
                userModelPreference {
                    id
                    userId
                    modelId
                    createdAt
                    updatedAt
                }
            }
        }
    `;

    const result = await postGraphileRequest<CreateUserModelPreferenceMutationResult, { userId: string; modelId: string }>( {
        mutation: CREATE_USER_MODEL_PREFERENCE
        , variables: { userId, modelId }
    } );

    if ( result.isError() ) {
        return error( new UserModelPreferenceUpdateFailed() );
    }

    if ( !result.value.createUserModelPreference?.userModelPreference ) {
        return error( new UserModelPreferenceUpdateFailed() );
    }

    return success( result.value.createUserModelPreference.userModelPreference );

};

/**
 * update a user model preference by id
 *
 * @param preferenceId - preference id
 * @param modelId - model id
 * @returns Either<ResourceError, UserModelPreferenceRecord>
 */
export const updateUserModelPreferenceById = async (
    preferenceId: string
    , modelId: string
): Promise<Either<ResourceError, UserModelPreferenceRecord>> => {

    const UPDATE_USER_MODEL_PREFERENCE = gql`
        mutation updateUserModelPreference($id: UUID!, $modelId: String!) {
            updateUserModelPreferenceById(input: {
                id: $id
                userModelPreferencePatch: {
                    modelId: $modelId
                }
            }) {
                userModelPreference {
                    id
                    userId
                    modelId
                    createdAt
                    updatedAt
                }
            }
        }
    `;

    const result = await postGraphileRequest<UpdateUserModelPreferenceMutationResult, { id: string; modelId: string }>( {
        mutation: UPDATE_USER_MODEL_PREFERENCE
        , variables: { id: preferenceId, modelId }
    } );

    if ( result.isError() ) {
        return error( new UserModelPreferenceUpdateFailed() );
    }

    if ( !result.value.updateUserModelPreferenceById?.userModelPreference ) {
        return error( new UserModelPreferenceUpdateFailed() );
    }

    return success( result.value.updateUserModelPreferenceById.userModelPreference );

};
