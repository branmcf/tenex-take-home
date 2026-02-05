import { ResourceError } from '../../../errors';

export class UserModelPreferenceFetchFailed extends ResourceError {
    constructor () {
        super( {
            message: 'Failed to fetch user model preference.'
            , clientMessage: 'Unable to load model preference.'
            , code: 'USER_MODEL_PREFERENCE_FETCH_FAILED'
            , statusCode: 500
        } );
    }
}

export class UserModelPreferenceUpdateFailed extends ResourceError {
    constructor () {
        super( {
            message: 'Failed to update user model preference.'
            , clientMessage: 'Unable to save model preference.'
            , code: 'USER_MODEL_PREFERENCE_UPDATE_FAILED'
            , statusCode: 500
        } );
    }
}
