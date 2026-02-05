import { getRedisClient } from '../../lib/redis';
import { RateLimitInfo } from './rateLimiter.types';
import { Log } from '../../utils';

/**
 * In-memory store for rate limiting when Redis is unavailable
 */
interface MemoryStoreEntry {
    count: number;
    resetAt: number;
}

const memoryStore = new Map<string, MemoryStoreEntry>();

// Clean up expired entries every minute
setInterval( () => {
    const now = Date.now();

    for ( const [ key, entry ] of memoryStore.entries() ) {
        if ( entry.resetAt <= now ) {
            memoryStore.delete( key );
        }
    }
}, 60000 );

/**
 * Check rate limit using Redis (sliding window algorithm)
 */
const checkRateLimitRedis = async (
    key: string
    , maxRequests: number
    , windowSeconds: number
): Promise<RateLimitInfo> => {

    const redis = getRedisClient();

    if ( !redis ) {
        return checkRateLimitMemory( key, maxRequests, windowSeconds );
    }

    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const windowStart = now - windowMs;

    try {
        // Use Redis sorted set for sliding window
        const redisKey = `ratelimit:${ key }`;

        // Execute atomic operation
        const pipeline = redis.pipeline();

        // Remove old entries outside the window
        pipeline.zremrangebyscore( redisKey, 0, windowStart );

        // Add current request
        pipeline.zadd( redisKey, now, `${ now }-${ Math.random() }` );

        // Count requests in window
        pipeline.zcard( redisKey );

        // Set expiry on the key
        pipeline.expire( redisKey, windowSeconds + 1 );

        const results = await pipeline.exec();

        if ( !results ) {
            Log.warn( '[RATE_LIMIT] Redis pipeline returned null, falling back to memory' );
            return checkRateLimitMemory( key, maxRequests, windowSeconds );
        }

        // Get count from the third command (zcard)
        const current = results[ 2 ]?.[ 1 ] as number ?? 0;
        const allowed = current <= maxRequests;
        const remaining = Math.max( 0, maxRequests - current );

        return {
            allowed
            , remaining
            , limit: maxRequests
            , resetIn: windowSeconds
            , current
        };

    } catch ( err ) {
        Log.error( '[RATE_LIMIT] Redis error, falling back to memory', err );
        return checkRateLimitMemory( key, maxRequests, windowSeconds );
    }
};

/**
 * Check rate limit using in-memory store (fixed window fallback)
 */
const checkRateLimitMemory = (
    key: string
    , maxRequests: number
    , windowSeconds: number
): RateLimitInfo => {

    const now = Date.now();
    const windowMs = windowSeconds * 1000;

    let entry = memoryStore.get( key );

    // Create new entry or reset expired entry
    if ( !entry || entry.resetAt <= now ) {
        entry = {
            count: 1
            , resetAt: now + windowMs
        };
        memoryStore.set( key, entry );

        return {
            allowed: true
            , remaining: maxRequests - 1
            , limit: maxRequests
            , resetIn: windowSeconds
            , current: 1
        };
    }

    // Increment existing entry
    entry.count += 1;
    const allowed = entry.count <= maxRequests;
    const remaining = Math.max( 0, maxRequests - entry.count );
    const resetIn = Math.ceil( ( entry.resetAt - now ) / 1000 );

    return {
        allowed
        , remaining
        , limit: maxRequests
        , resetIn
        , current: entry.count
    };
};

/**
 * Check if a request is within rate limits
 *
 * @param key - Unique key for the rate limit (e.g., IP address, user ID)
 * @param maxRequests - Maximum requests allowed in the window
 * @param windowSeconds - Time window in seconds
 * @returns Rate limit info
 */
export const checkRateLimit = async (
    key: string
    , maxRequests: number
    , windowSeconds: number
): Promise<RateLimitInfo> => {
    return checkRateLimitRedis( key, maxRequests, windowSeconds );
};
