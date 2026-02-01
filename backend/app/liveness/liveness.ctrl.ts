import { Request, Response } from 'express';
import { ResourceError } from '../../errors';

/**
 * @title Get Liveness Handler
 * @notice Handles liveness check requests to verify the service is running
 * @dev Returns a 200 status with null body to indicate the service is alive
 * @param req The Express request object
 * @param res The Express response object that can return ResourceError or null
 * @return Promise that resolves to an Express response with 200 status and null
 */
export const getLivenessHandler = async (
    req: Request
    , res: Response<ResourceError | null>
): Promise<Response<ResourceError | null>> => {

    return res
        .status( 200 )
        .json( null );
};