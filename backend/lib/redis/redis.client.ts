import Redis from 'ioredis';
import { Log } from '../../utils';

let redisClient: Redis | null = null;
let connectionAttempted = false;

/**
 * Get or create the Redis client singleton
 *
 * @returns Redis client or null if connection fails
 */
export const getRedisClient = (): Redis | null => {

    // Return existing client if already connected
    if ( redisClient ) {
        return redisClient;
    }

    // Don't retry if we've already attempted and failed
    if ( connectionAttempted && !redisClient ) {
        return null;
    }

    connectionAttempted = true;

    const redisUrl = process.env.REDIS_URL;

    // Return null if Redis URL is not configured
    if ( !redisUrl ) {
        Log.warn( '[REDIS] REDIS_URL not configured, rate limiting will use in-memory fallback' );
        return null;
    }

    try {
        redisClient = new Redis( redisUrl, {
            maxRetriesPerRequest: 3
            , retryStrategy: ( times ) => {
                if ( times > 3 ) {
                    Log.error( '[REDIS] Max retries reached, giving up' );
                    return null;
                }

                return Math.min( times * 100, 3000 );
            }
            , lazyConnect: true
        } );

        redisClient.on( 'connect', () => {
            Log.info( '[REDIS] Connected successfully' );
        } );

        redisClient.on( 'error', ( err ) => {
            Log.error( '[REDIS] Connection error', err );
        } );

        redisClient.on( 'close', () => {
            Log.warn( '[REDIS] Connection closed' );
        } );

        // Attempt to connect
        redisClient.connect().catch( ( err ) => {
            Log.error( '[REDIS] Failed to connect', err );
            redisClient = null;
        } );

        return redisClient;

    } catch ( err ) {
        Log.error( '[REDIS] Failed to create client', err );
        redisClient = null;
        return null;
    }
};

/**
 * Close the Redis connection
 */
export const closeRedisClient = async (): Promise<void> => {
    if ( redisClient ) {
        await redisClient.quit();
        redisClient = null;
        connectionAttempted = false;
    }
};
