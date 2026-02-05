import {
    Request
    , Response
    , NextFunction
} from 'express';
import { ResourceError } from '../../errors';
import { validateChatOwnership } from './chatOwnershipValidator.helper';
import { ChatNotFoundError } from './chatOwnershipValidator.errors';

/**
 * Express middleware to validate that a chat belongs to the authenticated user
 *
 * @description
 * This middleware validates that:
 * 1. A chatId is provided in the URL params
 * 2. The chat exists and is not deleted
 * 3. The chat belongs to the authenticated user
 *
 * This should be used after sessionValidator middleware.
 *
 * @param req - Express Request object containing params.chatId
 * @param res - Express Response object with locals.session
 * @param next - Express NextFunction to pass control to next middleware
 * @returns Promise resolving to an error or void (continues middleware chain)
 */
export const chatOwnershipValidator = async (
    req: Request
    , res: Response<ResourceError>
    , next: NextFunction
): Promise<Response<ResourceError> | void> => {

    // get chatId from URL params
    const { chatId } = req.params;

    // get session from res.locals (set by sessionValidator)
    const session = res.locals.session;

    // get the authenticated user's id from session
    const sessionUserId = session?.user?.id;

    try {

        // validate that the chat belongs to the user
        await validateChatOwnership( chatId, sessionUserId );

        // validation passed, continue to next middleware
        return next();

    } catch ( validationError ) {

        // cast the error to ResourceError type
        const error = validationError as ResourceError;

        // allow chat creation on message POSTs when chat does not exist yet
        const isMessageCreate = req.method === 'POST'
            && ( req.originalUrl?.endsWith( '/messages' ) || req.originalUrl?.endsWith( '/messages/stream' ) );

        if ( isMessageCreate && error instanceof ChatNotFoundError ) {
            const bodyUserId = typeof req.body?.userId === 'string' ? req.body.userId : null;

            if ( bodyUserId && sessionUserId && bodyUserId === sessionUserId ) {
                return next();
            }
        }

        // return error response with status code and error details
        return res
            .status( error.statusCode )
            .json( error );
    }

};
