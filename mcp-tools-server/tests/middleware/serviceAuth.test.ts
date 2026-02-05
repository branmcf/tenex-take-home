/**
 * Unit tests for serviceAuth middleware
 */
import supertest from 'supertest';
import express from 'express';
import { serviceAuth } from '../../middleware/serviceAuth';

/**
 * Create a test app with serviceAuth middleware
 */
const createAuthTestApp = () => {
    const app = express();
    app.use( express.json() );
    app.use( serviceAuth );
    app.get( '/test', ( _req, res ) => {
        res.status( 200 ).json( { success: true } );
    } );
    app.post( '/test', ( _req, res ) => {
        res.status( 200 ).json( { success: true } );
    } );
    return app;
};

/**
 * serviceAuth middleware
 */
describe( 'serviceAuth middleware', () => {

    const originalApiKey = process.env.MCP_TOOLS_API_KEY;

    beforeEach( () => {
        process.env.MCP_TOOLS_API_KEY = 'test-api-key';
    } );

    afterEach( () => {
        process.env.MCP_TOOLS_API_KEY = originalApiKey;
    } );

    describe( 'when service key is configured', () => {

        it(
            'allows request with correct service key'
            , async () => {

                // create app and make request
                const app = createAuthTestApp();
                const result = await supertest( app )
                    .get( '/test' )
                    .set( 'x-service-key', 'test-api-key' );

                // check success
                expect( result.status ).toBe( 200 );
                expect( result.body ).toEqual( { success: true } );

            }
        );

        it(
            'rejects request with incorrect service key'
            , async () => {

                // create app and make request with wrong key
                const app = createAuthTestApp();
                const result = await supertest( app )
                    .get( '/test' )
                    .set( 'x-service-key', 'wrong-key' );

                // check rejected
                expect( result.status ).toBe( 401 );
                expect( result.body ).toMatchObject( {
                    code: 'UNAUTHORIZED'
                    , statusCode: 401
                } );

            }
        );

        it(
            'rejects request with missing service key'
            , async () => {

                // create app and make request without key
                const app = createAuthTestApp();
                const result = await supertest( app )
                    .get( '/test' );

                // check rejected
                expect( result.status ).toBe( 401 );
                expect( result.body ).toMatchObject( {
                    code: 'UNAUTHORIZED'
                    , statusCode: 401
                } );

            }
        );

        it(
            'handles service key with surrounding quotes'
            , async () => {

                // set key with quotes in env
                process.env.MCP_TOOLS_API_KEY = '"quoted-key"';

                // create app and make request with unquoted key
                const app = createAuthTestApp();
                const result = await supertest( app )
                    .get( '/test' )
                    .set( 'x-service-key', 'quoted-key' );

                // check success
                expect( result.status ).toBe( 200 );

            }
        );

        it(
            'handles header key with surrounding quotes'
            , async () => {

                // set key without quotes
                process.env.MCP_TOOLS_API_KEY = 'test-key';

                // create app and make request with quoted header
                const app = createAuthTestApp();
                const result = await supertest( app )
                    .get( '/test' )
                    .set( 'x-service-key', '"test-key"' );

                // check success
                expect( result.status ).toBe( 200 );

            }
        );

        it(
            'works for POST requests'
            , async () => {

                // create app and make POST request
                const app = createAuthTestApp();
                const result = await supertest( app )
                    .post( '/test' )
                    .set( 'x-service-key', 'test-api-key' )
                    .send( { data: 'test' } );

                // check success
                expect( result.status ).toBe( 200 );
                expect( result.body ).toEqual( { success: true } );

            }
        );

    } );

    describe( 'when service key is not configured', () => {

        it(
            'allows all requests when no service key set'
            , async () => {

                // unset service key
                delete process.env.MCP_TOOLS_API_KEY;

                // create app and make request without key
                const app = createAuthTestApp();
                const result = await supertest( app )
                    .get( '/test' );

                // check success (no auth required when no key configured)
                expect( result.status ).toBe( 200 );

            }
        );

        it(
            'allows requests with empty service key env'
            , async () => {

                // set empty service key
                process.env.MCP_TOOLS_API_KEY = '';

                // create app and make request
                const app = createAuthTestApp();
                const result = await supertest( app )
                    .get( '/test' );

                // check success
                expect( result.status ).toBe( 200 );

            }
        );

    } );

} );
