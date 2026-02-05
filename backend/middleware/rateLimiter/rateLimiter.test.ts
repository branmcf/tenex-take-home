import express, { Express } from 'express';
import supertest from 'supertest';
import {
    rateLimiter
    , userRateLimiter
    , endpointRateLimiter
} from './rateLimiter';
import { RateLimitExceededError } from './rateLimiter.errors';
import { RATE_LIMIT_PRESETS } from './rateLimiter.types';

/**
 * Create test app with rate limiter
 */
const createTestApp = (
    config: Parameters<typeof rateLimiter>[ 0 ]
): Express => {
    const app = express();
    app.use( express.json() );
    app.use( rateLimiter( config ) );
    app.get( '/test', ( _req, res ) => {
        res.status( 200 ).json( { success: true } );
    } );
    app.post( '/test', ( _req, res ) => {
        res.status( 200 ).json( { success: true } );
    } );
    return app;
};

/**
 * rateLimiter middleware
 */
describe( 'rateLimiter', () => {

    describe( 'allows requests within limit', () => {

        it(
            'allows requests under the limit'
            , async () => {

                // create app with limit of 5
                const app = createTestApp( { maxRequests: 5, windowSeconds: 60 } );
                const request = supertest( app );

                // make 3 requests - all should succeed
                for ( let i = 0; i < 3; i++ ) {
                    const result = await request.get( '/test' );
                    expect( result.status ).toBe( 200 );
                    expect( result.body ).toEqual( { success: true } );
                }

            }
        );

        it(
            'includes rate limit headers in response'
            , async () => {

                // create app
                const app = createTestApp( { maxRequests: 10, windowSeconds: 60 } );
                const request = supertest( app );

                // make request
                const result = await request.get( '/test' );

                // check headers
                expect( result.headers[ 'x-ratelimit-limit' ] ).toBe( '10' );
                expect( result.headers[ 'x-ratelimit-remaining' ] ).toBeDefined();
                expect( result.headers[ 'x-ratelimit-reset' ] ).toBeDefined();

            }
        );

        it(
            'does not include headers when disabled'
            , async () => {

                // create app with headers disabled
                const app = createTestApp( {
                    maxRequests: 10
                    , windowSeconds: 60
                    , includeHeaders: false
                } );
                const request = supertest( app );

                // make request
                const result = await request.get( '/test' );

                // check no rate limit headers
                expect( result.headers[ 'x-ratelimit-limit' ] ).toBeUndefined();

            }
        );

    } );

    describe( 'blocks requests over limit', () => {

        it(
            'returns 429 when limit exceeded'
            , async () => {

                // create app with very low limit
                const app = createTestApp( { maxRequests: 2, windowSeconds: 60 } );
                const request = supertest( app );

                // make requests up to limit
                await request.get( '/test' );
                await request.get( '/test' );

                // third request should be blocked
                const result = await request.get( '/test' );

                expect( result.status ).toBe( 429 );
                expect( result.body ).toMatchObject( {
                    code: 'RATE_LIMIT_EXCEEDED'
                    , statusCode: 429
                } );

            }
        );

        it(
            'includes Retry-After header when blocked'
            , async () => {

                // create app with very low limit
                const app = createTestApp( { maxRequests: 1, windowSeconds: 60 } );
                const request = supertest( app );

                // exhaust limit
                await request.get( '/test' );

                // blocked request
                const result = await request.get( '/test' );

                expect( result.status ).toBe( 429 );
                expect( result.headers[ 'retry-after' ] ).toBeDefined();

            }
        );

        it(
            'uses custom message when provided'
            , async () => {

                // create app with custom message
                const app = createTestApp( {
                    maxRequests: 1
                    , windowSeconds: 60
                    , message: 'Custom rate limit message'
                } );
                const request = supertest( app );

                // exhaust limit
                await request.get( '/test' );

                // blocked request
                const result = await request.get( '/test' );

                expect( result.status ).toBe( 429 );
                expect( result.body.clientMessage ).toBe( 'Custom rate limit message' );

            }
        );

    } );

    describe( 'skip configuration', () => {

        it(
            'skips rate limiting when skip returns true'
            , async () => {

                // create app that skips all requests
                const app = createTestApp( {
                    maxRequests: 1
                    , windowSeconds: 60
                    , skip: () => true
                } );
                const request = supertest( app );

                // make many requests - all should succeed
                for ( let i = 0; i < 10; i++ ) {
                    const result = await request.get( '/test' );
                    expect( result.status ).toBe( 200 );
                }

            }
        );

        it(
            'applies rate limiting when skip returns false'
            , async () => {

                // create app that doesn't skip
                const app = createTestApp( {
                    maxRequests: 2
                    , windowSeconds: 60
                    , skip: () => false
                } );
                const request = supertest( app );

                // exhaust limit
                await request.get( '/test' );
                await request.get( '/test' );

                // should be blocked
                const result = await request.get( '/test' );
                expect( result.status ).toBe( 429 );

            }
        );

    } );

    describe( 'custom key generator', () => {

        it(
            'uses custom key generator'
            , async () => {

                // create app with custom key based on query param
                const app = express();
                app.use( express.json() );
                app.use( rateLimiter( {
                    maxRequests: 2
                    , windowSeconds: 60
                    , keyGenerator: ( req ) => {
                        const expressReq = req as express.Request;
                        return String( expressReq.query.userId ?? 'default' );
                    }
                } ) );
                app.get( '/test', ( _req, res ) => {
                    res.status( 200 ).json( { success: true } );
                } );

                const request = supertest( app );

                // user1 makes 2 requests - at limit
                await request.get( '/test?userId=user1' );
                await request.get( '/test?userId=user1' );

                // user1's third request should be blocked
                const user1Result = await request.get( '/test?userId=user1' );
                expect( user1Result.status ).toBe( 429 );

                // user2 should still be able to make requests
                const user2Result = await request.get( '/test?userId=user2' );
                expect( user2Result.status ).toBe( 200 );

            }
        );

    } );

} );

/**
 * RateLimitExceededError
 */
describe( 'RateLimitExceededError', () => {

    it(
        'has correct properties'
        , () => {

            const error = new RateLimitExceededError( 30 );

            expect( error.statusCode ).toBe( 429 );
            expect( error.code ).toBe( 'RATE_LIMIT_EXCEEDED' );
            expect( error.retryAfter ).toBe( 30 );
            expect( error.clientMessage ).toBe( 'Too many requests. Please try again later.' );

        }
    );

    it(
        'accepts custom message'
        , () => {

            const error = new RateLimitExceededError( 60, 'Custom message' );

            expect( error.clientMessage ).toBe( 'Custom message' );
            expect( error.retryAfter ).toBe( 60 );

        }
    );

} );

/**
 * RATE_LIMIT_PRESETS
 */
describe( 'RATE_LIMIT_PRESETS', () => {

    it(
        'has standard preset'
        , () => {

            expect( RATE_LIMIT_PRESETS.standard ).toMatchObject( {
                maxRequests: 100
                , windowSeconds: 60
            } );

        }
    );

    it(
        'has auth preset with stricter limits'
        , () => {

            expect( RATE_LIMIT_PRESETS.auth ).toMatchObject( {
                maxRequests: 10
                , windowSeconds: 60
            } );

            // Auth should be stricter than standard
            expect( RATE_LIMIT_PRESETS.auth.maxRequests ).toBeLessThan(
                RATE_LIMIT_PRESETS.standard.maxRequests
            );

        }
    );

    it(
        'has llm preset for expensive operations'
        , () => {

            expect( RATE_LIMIT_PRESETS.llm ).toMatchObject( {
                maxRequests: 20
                , windowSeconds: 60
            } );

        }
    );

    it(
        'has webhook preset with higher limits'
        , () => {

            expect( RATE_LIMIT_PRESETS.webhook ).toMatchObject( {
                maxRequests: 200
                , windowSeconds: 60
            } );

        }
    );

} );
