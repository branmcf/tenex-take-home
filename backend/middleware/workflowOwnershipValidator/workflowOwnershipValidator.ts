import {
    Request
    , Response
    , NextFunction
} from 'express';
import { ResourceError } from '../../errors';
import { validateWorkflowOwnership } from './workflowOwnershipValidator.helper';

/**
 * Express middleware to validate that a workflow belongs to the authenticated user
 *
 * @description
 * This middleware validates that:
 * 1. A workflowId is provided in the URL params
 * 2. The workflow exists and is not deleted
 * 3. The workflow belongs to the authenticated user
 *
 * This should be used after sessionValidator middleware.
 *
 * @param req - Express Request object containing params.workflowId
 * @param res - Express Response object with locals.session
 * @param next - Express NextFunction to pass control to next middleware
 * @returns Promise resolving to an error or void (continues middleware chain)
 */
export const workflowOwnershipValidator = async (
    req: Request
    , res: Response<ResourceError>
    , next: NextFunction
): Promise<Response<ResourceError> | void> => {

    // get workflowId from URL params
    const { workflowId } = req.params;

    // get session from res.locals (set by sessionValidator)
    const session = res.locals.session;

    // get the authenticated user's id from session
    const sessionUserId = session?.user?.id;

    try {

        // validate that the workflow belongs to the user
        await validateWorkflowOwnership( workflowId, sessionUserId );

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
