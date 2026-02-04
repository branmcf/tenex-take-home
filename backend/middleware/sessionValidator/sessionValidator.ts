import {
    NextFunction
    , Request
    , Response
} from 'express';
import { auth } from '../../lib/betterAuth';
import {
    ResourceError
    , UnauthorizedError
} from '../../errors';

/**
 * Express middleware to validate user sessions
 *
 * @description
 * This middleware validates the session by:
 * 1. Converting Express request headers to Web API Headers format
 * 2. Calling BetterAuth API to get and validate the session
 * 3. Checking if a valid user ID exists in the session
 * 4. Adding the session to res.locals for downstream middleware/handlers
 *
 * @param req - Express Request object containing headers
 * @param res - Express Response object
 * @param next - Express NextFunction to pass control to next middleware
 * @returns Promise resolving to an error or void (continues middleware chain)
 * @throws UnauthorizedError if no valid session is found
 */
export const sessionValidator = async (
    req: Request
    , res: Response<ResourceError>
    , next: NextFunction
): Promise<Response<ResourceError> | void> => {

    // Create a new Headers object for Web API compatibility
    const headers = new Headers();

    // Convert Express headers to Web API Headers format
    Object.entries( req.headers ).forEach( ( [ key, value ] ) => {
        if ( typeof value === 'string' ) {
            // Handle single header values
            headers.append( key, value );
        } else if ( Array.isArray( value ) ) {
            // Handle multiple header values
            value.forEach( ( v ) => headers.append( key, v ) );
        }
    } );

    // Get session from BetterAuth API
    const session = await auth.api.getSession( { headers } );

    // Check if session contains a valid user ID
    if ( !session?.user?.id ) {
        const unauthorizedError = new UnauthorizedError();
        return res
            .status( unauthorizedError.statusCode )
            .json( unauthorizedError );
    }

    // Add session to response locals for downstream use
    res.locals.session = session;

    // Continue to next middleware
    return next();
};