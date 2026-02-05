/* ----------------- Mocks ----------------------- */

import { postGraphileRequest } from '../../lib/postGraphile/__mocks__/postGraphile.request';
import {
    auth
    , mockSessionOnce
    , mockNoSessionOnce
} from '../../lib/betterAuth/__mocks__/auth';

/* ----------------- Mocks ----------------------- */

import supertest from 'supertest';
import { testApp } from '../tests.server';

import * as ModelsService from '../../app/models/models.service';
import { ResourceError } from '../../errors';
import {
    ModelsNotFound
    , GetModelsFailed
} from '../../app/models/models.errors';

// set up server for testing
const server = testApp.listen();
const request = supertest( server );

afterAll( async () => {
    server.close();
} );

/**
 * GET /api/models
 */
describe( 'GET /api/models', () => {

    beforeEach( async () => {
        jest.clearAllMocks();
    } );

    describe( 'returns authentication errors', () => {

        it(
            'returns 401 UNAUTHORIZED when no session is provided'
            , async () => {

                // create test specific data - NONE

                // create spys - NONE

                // create mocks
                mockNoSessionOnce();

                // send request
                const result = await request
                    .get( '/api/models' );

                // get spy results - NONE

                // check times called - NONE

                // check called with - NONE

                // check spy results - NONE

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'UNAUTHORIZED'
                    , statusCode: 401
                } );

                // check status code
                expect( result.status ).toBe( 401 );

            }
        );

        it(
            'returns 401 UNAUTHORIZED when session has no user'
            , async () => {

                // create test specific data - NONE

                // create spys - NONE

                // create mocks
                auth.api.getSession.mockResolvedValueOnce( { user: null } );

                // send request
                const result = await request
                    .get( '/api/models' );

                // get spy results - NONE

                // check times called - NONE

                // check called with - NONE

                // check spy results - NONE

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'UNAUTHORIZED'
                    , statusCode: 401
                } );

                // check status code
                expect( result.status ).toBe( 401 );

            }
        );

    } );

    describe( 'the request to endpoint is valid', () => {

        it(
            'returns 200 with models array when models exist'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const modelId1 = 'gpt-4o';
                const modelId2 = 'claude-3-opus';

                // create spys
                const getActiveModelsSpy = jest.spyOn( ModelsService, 'getActiveModels' );

                // create mocks
                mockSessionOnce( {
                    user: {
                        id: sessionUserId
                        , email: 'test@example.com'
                        , name: 'Test User'
                        , emailVerified: true
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                    , session: {
                        id: 'mock-session-id'
                        , userId: sessionUserId
                        , expiresAt: new Date( Date.now() + ( 24 * 60 * 60 * 1000 ) )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                postGraphileRequest.mockResponseOnce( {
                    allModels: {
                        nodes: [
                            {
                                id: modelId1
                                , name: 'GPT-4o'
                                , provider: 'openai'
                            }
                            , {
                                id: modelId2
                                , name: 'Claude 3 Opus'
                                , provider: 'anthropic'
                            }
                        ]
                    }
                } );

                // send request
                const result = await request
                    .get( '/api/models' );

                // get spy results
                const spyResult = await getActiveModelsSpy.mock.results[ 0 ].value;

                // check times called
                expect( getActiveModelsSpy ).toHaveBeenCalledTimes( 1 );

                // check spy results
                expect( spyResult.isSuccess() ).toBe( true );

                // check result
                expect( result.body ).toStrictEqual( {
                    models: [
                        {
                            id: modelId1
                            , name: 'GPT-4o'
                            , provider: 'openai'
                        }
                        , {
                            id: modelId2
                            , name: 'Claude 3 Opus'
                            , provider: 'anthropic'
                        }
                    ]
                } );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

        it(
            'returns 200 with empty models array filtered from null values'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const modelId1 = 'gpt-4o';

                // create spys
                const getActiveModelsSpy = jest.spyOn( ModelsService, 'getActiveModels' );

                // create mocks
                mockSessionOnce( {
                    user: {
                        id: sessionUserId
                        , email: 'test@example.com'
                        , name: 'Test User'
                        , emailVerified: true
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                    , session: {
                        id: 'mock-session-id'
                        , userId: sessionUserId
                        , expiresAt: new Date( Date.now() + ( 24 * 60 * 60 * 1000 ) )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                postGraphileRequest.mockResponseOnce( {
                    allModels: {
                        nodes: [
                            null
                            , {
                                id: modelId1
                                , name: 'GPT-4o'
                                , provider: 'openai'
                            }
                            , null
                        ]
                    }
                } );

                // send request
                const result = await request
                    .get( '/api/models' );

                // get spy results
                const spyResult = await getActiveModelsSpy.mock.results[ 0 ].value;

                // check times called
                expect( getActiveModelsSpy ).toHaveBeenCalledTimes( 1 );

                // check spy results
                expect( spyResult.isSuccess() ).toBe( true );

                // check result - null values should be filtered out
                expect( result.body ).toStrictEqual( {
                    models: [
                        {
                            id: modelId1
                            , name: 'GPT-4o'
                            , provider: 'openai'
                        }
                    ]
                } );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

    } );

    describe( 'service layer errors', () => {

        it(
            'returns 404 MODELS_NOT_FOUND when no models exist'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';

                // create spys
                const getActiveModelsSpy = jest.spyOn( ModelsService, 'getActiveModels' );

                // create mocks
                mockSessionOnce( {
                    user: {
                        id: sessionUserId
                        , email: 'test@example.com'
                        , name: 'Test User'
                        , emailVerified: true
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                    , session: {
                        id: 'mock-session-id'
                        , userId: sessionUserId
                        , expiresAt: new Date( Date.now() + ( 24 * 60 * 60 * 1000 ) )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                postGraphileRequest.mockResponseOnce( {
                    allModels: {
                        nodes: []
                    }
                } );

                // send request
                const result = await request
                    .get( '/api/models' );

                // get spy results
                const spyResult = await getActiveModelsSpy.mock.results[ 0 ].value;

                // check times called
                expect( getActiveModelsSpy ).toHaveBeenCalledTimes( 1 );

                // check spy results
                expect( spyResult.isError() ).toBe( true );

                // check result
                expect( result.body ).toMatchObject( {
                    clientMessage: 'No models found.'
                    , code: 'MODELS_NOT_FOUND'
                    , statusCode: 404
                } );

                // check status code
                expect( result.status ).toBe( 404 );

            }
        );

        it(
            'returns 404 MODELS_NOT_FOUND when allModels is null'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';

                // create spys
                const getActiveModelsSpy = jest.spyOn( ModelsService, 'getActiveModels' );

                // create mocks
                mockSessionOnce( {
                    user: {
                        id: sessionUserId
                        , email: 'test@example.com'
                        , name: 'Test User'
                        , emailVerified: true
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                    , session: {
                        id: 'mock-session-id'
                        , userId: sessionUserId
                        , expiresAt: new Date( Date.now() + ( 24 * 60 * 60 * 1000 ) )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                postGraphileRequest.mockResponseOnce( {
                    allModels: null
                } );

                // send request
                const result = await request
                    .get( '/api/models' );

                // get spy results
                const spyResult = await getActiveModelsSpy.mock.results[ 0 ].value;

                // check times called
                expect( getActiveModelsSpy ).toHaveBeenCalledTimes( 1 );

                // check spy results
                expect( spyResult.isError() ).toBe( true );

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'MODELS_NOT_FOUND'
                    , statusCode: 404
                } );

                // check status code
                expect( result.status ).toBe( 404 );

            }
        );

        it(
            'returns error when postGraphile request fails'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';

                // create spys
                const getActiveModelsSpy = jest.spyOn( ModelsService, 'getActiveModels' );

                // create mocks
                mockSessionOnce( {
                    user: {
                        id: sessionUserId
                        , email: 'test@example.com'
                        , name: 'Test User'
                        , emailVerified: true
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                    , session: {
                        id: 'mock-session-id'
                        , userId: sessionUserId
                        , expiresAt: new Date( Date.now() + ( 24 * 60 * 60 * 1000 ) )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                postGraphileRequest.mockResponseErrorOnce(
                    new ResourceError( {
                        message: 'Database connection failed'
                        , code: 'DATABASE_ERROR'
                        , statusCode: 500
                    } )
                );

                // send request
                const result = await request
                    .get( '/api/models' );

                // get spy results
                const spyResult = await getActiveModelsSpy.mock.results[ 0 ].value;

                // check times called
                expect( getActiveModelsSpy ).toHaveBeenCalledTimes( 1 );

                // check spy results
                expect( spyResult.isError() ).toBe( true );

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'DATABASE_ERROR'
                    , statusCode: 500
                } );

                // check status code
                expect( result.status ).toBe( 500 );

            }
        );

    } );

    describe( 'edge cases', () => {

        it(
            'handles allModels.nodes being null'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';

                // create spys
                const getActiveModelsSpy = jest.spyOn( ModelsService, 'getActiveModels' );

                // create mocks
                mockSessionOnce( {
                    user: {
                        id: sessionUserId
                        , email: 'test@example.com'
                        , name: 'Test User'
                        , emailVerified: true
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                    , session: {
                        id: 'mock-session-id'
                        , userId: sessionUserId
                        , expiresAt: new Date( Date.now() + ( 24 * 60 * 60 * 1000 ) )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                postGraphileRequest.mockResponseOnce( {
                    allModels: {
                        nodes: null
                    }
                } );

                // send request
                const result = await request
                    .get( '/api/models' );

                // get spy results
                const spyResult = await getActiveModelsSpy.mock.results[ 0 ].value;

                // check times called
                expect( getActiveModelsSpy ).toHaveBeenCalledTimes( 1 );

                // check spy results
                expect( spyResult.isError() ).toBe( true );

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'MODELS_NOT_FOUND'
                    , statusCode: 404
                } );

                // check status code
                expect( result.status ).toBe( 404 );

            }
        );

    } );

} );

/**
 * Error classes unit tests
 */
describe( 'models error classes', () => {

    it(
        'ModelsNotFound has correct properties'
        , () => {

            // create error instance
            const error = new ModelsNotFound();

            // check properties
            expect( error.clientMessage ).toBe( 'No models found.' );
            expect( error.code ).toBe( 'MODELS_NOT_FOUND' );
            expect( error.statusCode ).toBe( 404 );

        }
    );

    it(
        'GetModelsFailed has correct properties'
        , () => {

            // create error instance
            const error = new GetModelsFailed();

            // check properties
            expect( error.clientMessage ).toBe( 'Failed to retrieve models.' );
            expect( error.code ).toBe( 'GET_MODELS_FAILED' );
            expect( error.statusCode ).toBe( 500 );

        }
    );

} );
