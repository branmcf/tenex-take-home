import { ResourceError } from '../../errors';

/**
 * Error thrown when rate limit is exceeded
 */
export class RateLimitExceededError extends ResourceError {
    public retryAfter: number;

    public constructor ( retryAfter: number, message?: string ) {
        super( {
            message: message ?? 'Too many requests. Please try again later.'
            , clientMessage: message ?? 'Too many requests. Please try again later.'
            , statusCode: 429
            , code: 'RATE_LIMIT_EXCEEDED'
        } );

        this.retryAfter = retryAfter;
    }
}
