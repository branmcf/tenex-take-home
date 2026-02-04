import {
    UserIdMismatchError
    , UserIdRequiredError
} from './userIdValidator.errors';

/**
 * validate that the userId in the URL matches the authenticated user's session
 *
 * @param urlUserId - the userId from the URL params
 * @param sessionUserId - the userId from the authenticated session
 * @throws UserIdRequiredError if urlUserId is not provided
 * @throws UserIdMismatchError if urlUserId does not match sessionUserId
 */
export const validateUserIdMatch = (
    urlUserId: string | undefined
    , sessionUserId: string
): void => {

    // check for falsy urlUserId
    if ( !urlUserId ) {
        throw new UserIdRequiredError();
    }

    // check if urlUserId matches sessionUserId
    if ( urlUserId !== sessionUserId ) {
        throw new UserIdMismatchError();
    }

};
