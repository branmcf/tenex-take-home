import {
    Request
    , Response
    , NextFunction
} from 'express';
import { ResourceError } from '../../errors';
import { validateUserIdMatch } from './userIdValidator.helper';

/**
 * Express middleware to validate userId in URL matches authenticated user
 *
 * @description
 * This middleware validates that:
 * 1. A userId is provided in the URL params
 * 2. The userId matches the authenticated user's session userId
 *
 * This should be used after sessionValidator middleware.
 *
 * @param req - Express Request object containing params.userId
 * @param res - Express Response object with locals.session
 * @param next - Express NextFunction to pass control to next middleware
 * @returns Promise resolving to an error or void (continues middleware chain)
 */
export const userIdValidator = async (
    req: Request
    , res: Response<ResourceError>
    , next: NextFunction
): Promise<Response<ResourceError> | void> => {

    // get userId from URL params
    const { userId } = req.params;

    // get session from res.locals (set by sessionValidator)
    const session = res.locals.session;

    // get the authenticated user's id from session
    const sessionUserId = session?.user?.id;

    try {

        // validate that the userId matches the session user
        validateUserIdMatch( userId, sessionUserId );

        // validation passed, continue to next middleware
        return next();

    } catch ( validationError ) {

        // cast the error to ResourceError type
        const error = validationError as ResourceError;

        // return error response with status code and error details
        return res
            .status( error.statusCode )
            .json( error );
    }

};
