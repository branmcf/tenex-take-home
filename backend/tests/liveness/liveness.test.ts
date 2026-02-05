/* ----------------- Mocks ----------------------- */

// Import mocks to trigger jest.doMock() - prevents ESM issues with better-auth
import '../../lib/postGraphile/__mocks__/postGraphile.request';
import '../../lib/betterAuth/__mocks__/auth';

/* ----------------- Mocks ----------------------- */

import supertest from 'supertest';
import { testApp } from '../tests.server';

// set up server for testing
const server = testApp.listen();
const request = supertest( server );

afterAll( async () => {
    server.close();
} );

/**
 * GET /api/liveness
 */
describe( 'GET /api/liveness', () => {

    beforeEach( async () => {
        jest.clearAllMocks();
    } );

    describe( 'the request to endpoint is valid', () => {

        it(
            'returns 200 with null body indicating service is alive'
            , async () => {

                // send request
                const result = await request
                    .get( '/api/liveness' );

                // check result
                expect( result.body ).toBeNull();

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

    } );

} );
