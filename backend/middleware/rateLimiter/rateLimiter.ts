import {
    NextFunction
    , Request
    , Response
} from 'express';
import {
    RateLimiterConfig
    , RateLimiterRequest
    , RateLimiterMiddleware
} from './rateLimiter.types';
import { RateLimitExceededError } from './rateLimiter.errors';
import { checkRateLimit } from './rateLimiter.store';
import { Log } from '../../utils';

/**
 * Default key generator - uses IP address with forwarded header support
 */
const defaultKeyGenerator = ( req: RateLimiterRequest ): string => {
    const forwarded = req.headers[ 'x-forwarded-for' ];
    const clientIp = req.headers[ 'x-client-ip' ];

    if ( typeof forwarded === 'string' ) {
        return forwarded.split( ',' )[ 0 ].trim();
    }

    if ( typeof clientIp === 'string' ) {
        return clientIp;
    }

    return req.ip ?? 'unknown';
};

/**
 * Create rate limiter middleware with the specified configuration
 *
 * @param config - Rate limiter configuration
 * @returns Express middleware function
 *
 * @example
 * // Apply to all routes
 * app.use(rateLimiter({ maxRequests: 100, windowSeconds: 60 }));
 *
 * @example
 * // Apply to specific route with custom key
 * app.use('/api/auth', rateLimiter({
 *   maxRequests: 10,
 *   windowSeconds: 60,
 *   keyGenerator: (req) => `auth:${req.ip}`
 * }));
 */
export const rateLimiter = ( config: RateLimiterConfig ) => {

    const {
        maxRequests
        , windowSeconds
        , keyGenerator = defaultKeyGenerator
        , skip
        , message
        , includeHeaders = true
    } = config;

    return async (
        req: Request
        , res: Response
        , next: NextFunction
    ): Promise<Response | void> => {

        // Check if we should skip rate limiting for this request
        if ( skip?.( req ) ) {
            return next();
        }

        // Generate the rate limit key
        const key = keyGenerator( req );

        try {
            // Check the rate limit
            const rateLimitInfo = await checkRateLimit( key, maxRequests, windowSeconds );

            // Add rate limit headers if configured
            if ( includeHeaders ) {
                res.setHeader( 'X-RateLimit-Limit', rateLimitInfo.limit );
                res.setHeader( 'X-RateLimit-Remaining', rateLimitInfo.remaining );
                res.setHeader( 'X-RateLimit-Reset', rateLimitInfo.resetIn );
            }

            // If rate limit exceeded, return 429 error
            if ( !rateLimitInfo.allowed ) {
                Log.warn( '[RATE_LIMIT] Rate limit exceeded', {
                    key
                    , current: rateLimitInfo.current
                    , limit: rateLimitInfo.limit
                    , path: req.path
                    , method: req.method
                } );

                if ( includeHeaders ) {
                    res.setHeader( 'Retry-After', rateLimitInfo.resetIn );
                }

                const error = new RateLimitExceededError( rateLimitInfo.resetIn, message );
                return res.status( 429 ).json( error );
            }

            // Continue to next middleware
            return next();

        } catch ( err ) {
            // Log error but don't block request on rate limiter failure
            Log.error( '[RATE_LIMIT] Error checking rate limit, allowing request', err );
            return next();
        }
    };
};

/**
 * Create a rate limiter that limits by authenticated user ID
 * Falls back to IP if user is not authenticated
 *
 * @param config - Rate limiter configuration (keyGenerator will be overridden)
 * @returns Express middleware function
 */
export const userRateLimiter = (
    config: Omit<RateLimiterConfig, 'keyGenerator'>
): RateLimiterMiddleware => {
    return rateLimiter( {
        ...config
        , keyGenerator: ( req ) => {
            // Check for user ID in res.locals (set by sessionValidator)
            const expressReq = req as Request;
            const userId = ( expressReq.res as Response )?.locals?.session?.user?.id;

            if ( userId ) {
                return `user:${ userId }`;
            }

            // Fall back to IP
            return `ip:${ defaultKeyGenerator( req ) }`;
        }
    } );
};

/**
 * Create a rate limiter that limits by endpoint path
 * Useful for protecting specific expensive endpoints
 *
 * @param config - Rate limiter configuration (keyGenerator will be overridden)
 * @returns Express middleware function
 */
export const endpointRateLimiter = (
    config: Omit<RateLimiterConfig, 'keyGenerator'>
): RateLimiterMiddleware => {
    return rateLimiter( {
        ...config
        , keyGenerator: ( req ) => {
            const ip = defaultKeyGenerator( req );
            return `endpoint:${ req.method }:${ req.path }:${ ip }`;
        }
    } );
};
