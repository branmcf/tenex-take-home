/* ----------------- Mocks ----------------------- */

import { postGraphileRequest } from '../../lib/postGraphile/__mocks__/postGraphile.request';
import {
    mockSessionOnce
    , mockNoSessionOnce
} from '../../lib/betterAuth/__mocks__/auth';

/* ----------------- Mocks ----------------------- */

import supertest from 'supertest';
import { testApp } from '../tests.server';
import { v4 as uuidv4 } from 'uuid';

import * as ChatsService from '../../app/chats/chats.service';
import * as WorkflowsService from '../../app/workflows/workflows.service';

// set up server for testing - supertest handles server lifecycle internally
const request = supertest( testApp );

/**
 * GET /api/users/:userId/chats
 * Note: This endpoint is covered in the chats tests, but we include basic
 * routing and authentication tests here for the users router.
 */
describe( 'GET /api/users/:userId/chats', () => {

    beforeEach( async () => {
        jest.clearAllMocks();
    } );

    describe( 'returns authentication errors', () => {

        it(
            'returns 401 UNAUTHORIZED when no session is provided'
            , async () => {

                // create test specific data
                const userId = 'test-user-id';

                // create spys - NONE

                // create mocks
                mockNoSessionOnce();

                // send request
                const result = await request
                    .get( `/api/users/${ userId }/chats` );

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

    describe( 'returns authorization errors', () => {

        it(
            'returns 403 USER_ID_MISMATCH when userId does not match session'
            , async () => {

                // create test specific data
                const sessionUserId = 'session-user-id';
                const requestedUserId = 'different-user-id';

                // create spys - NONE

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

                // send request
                const result = await request
                    .get( `/api/users/${ requestedUserId }/chats` );

                // get spy results - NONE

                // check times called - NONE

                // check called with - NONE

                // check spy results - NONE

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'USER_ID_MISMATCH'
                    , statusCode: 403
                } );

                // check status code
                expect( result.status ).toBe( 403 );

            }
        );

    } );

    describe( 'the request to endpoint is invalid', () => {

        it(
            'returns 400 when userId is empty'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';

                // create spys - NONE

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

                // send request
                const result = await request
                    .get( '/api/users/ /chats' );

                // get spy results - NONE

                // check times called - NONE

                // check called with - NONE

                // check spy results - NONE

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'REQUEST_VALIDATION'
                    , statusCode: 400
                } );

                // check status code
                expect( result.status ).toBe( 400 );

            }
        );

    } );

    describe( 'the request to endpoint is valid', () => {

        it(
            'returns 200 with chats array when user owns the chats'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const chatId1 = uuidv4();

                // create spys
                const getUserChatsSpy = jest.spyOn( ChatsService, 'getUserChats' );

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
                    userById: {
                        chatsByUserId: {
                            nodes: [
                                {
                                    id: chatId1
                                    , title: 'Test Chat'
                                    , updatedAt: '2024-01-01T00:00:00Z'
                                }
                            ]
                        }
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/users/${ sessionUserId }/chats` );

                // get spy results
                const spyResult = await getUserChatsSpy.mock.results[ 0 ].value;

                // check times called
                expect( getUserChatsSpy ).toHaveBeenCalledTimes( 1 );

                // check called with
                expect( getUserChatsSpy ).toHaveBeenCalledWith( {
                    userId: sessionUserId
                    , limit: undefined
                    , offset: undefined
                } );

                // check spy results
                expect( spyResult.isSuccess() ).toBe( true );

                // check result
                expect( result.body ).toStrictEqual( {
                    chats: [
                        {
                            id: chatId1
                            , title: 'Test Chat'
                            , updatedAt: '2024-01-01T00:00:00Z'
                        }
                    ]
                } );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

    } );

} );

/**
 * GET /api/users/:userId/workflows
 */
describe( 'GET /api/users/:userId/workflows', () => {

    beforeEach( async () => {
        jest.clearAllMocks();
    } );

    describe( 'returns authentication errors', () => {

        it(
            'returns 401 UNAUTHORIZED when no session is provided'
            , async () => {

                // create test specific data
                const userId = 'test-user-id';

                // create spys - NONE

                // create mocks
                mockNoSessionOnce();

                // send request
                const result = await request
                    .get( `/api/users/${ userId }/workflows` );

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

    describe( 'returns authorization errors', () => {

        it(
            'returns 403 USER_ID_MISMATCH when userId does not match session'
            , async () => {

                // create test specific data
                const sessionUserId = 'session-user-id';
                const requestedUserId = 'different-user-id';

                // create spys - NONE

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

                // send request
                const result = await request
                    .get( `/api/users/${ requestedUserId }/workflows` );

                // get spy results - NONE

                // check times called - NONE

                // check called with - NONE

                // check spy results - NONE

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'USER_ID_MISMATCH'
                    , statusCode: 403
                } );

                // check status code
                expect( result.status ).toBe( 403 );

            }
        );

    } );

    describe( 'the request to endpoint is valid', () => {

        it(
            'returns 200 with workflows array'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const workflowId1 = uuidv4();

                // create spys
                const getUserWorkflowsSpy = jest.spyOn( WorkflowsService, 'getUserWorkflows' );

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
                    userById: {
                        workflowsByUserId: {
                            nodes: [
                                {
                                    id: workflowId1
                                    , name: 'Test Workflow'
                                    , description: 'A test workflow'
                                    , updatedAt: '2024-01-01T00:00:00Z'
                                    , workflowVersionsByWorkflowId: { nodes: [ { versionNumber: 1 } ] }
                                }
                            ]
                        }
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/users/${ sessionUserId }/workflows` );

                // get spy results
                const spyResult = await getUserWorkflowsSpy.mock.results[ 0 ].value;

                // check times called
                expect( getUserWorkflowsSpy ).toHaveBeenCalledTimes( 1 );

                // check called with
                expect( getUserWorkflowsSpy ).toHaveBeenCalledWith( sessionUserId );

                // check spy results
                expect( spyResult.isSuccess() ).toBe( true );

                // check result
                expect( result.body ).toStrictEqual( {
                    workflows: [
                        {
                            id: workflowId1
                            , name: 'Test Workflow'
                            , description: 'A test workflow'
                            , version: 1
                            , updatedAt: '2024-01-01T00:00:00Z'
                        }
                    ]
                } );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

        it(
            'returns 200 with workflows array with null version when no versions exist'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const workflowId1 = uuidv4();

                // create spys
                const getUserWorkflowsSpy = jest.spyOn( WorkflowsService, 'getUserWorkflows' );

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
                    userById: {
                        workflowsByUserId: {
                            nodes: [
                                {
                                    id: workflowId1
                                    , name: 'Test Workflow'
                                    , description: null
                                    , updatedAt: '2024-01-01T00:00:00Z'
                                    , workflowVersionsByWorkflowId: { nodes: [] }
                                }
                            ]
                        }
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/users/${ sessionUserId }/workflows` );

                // get spy results
                const spyResult = await getUserWorkflowsSpy.mock.results[ 0 ].value;

                // check times called
                expect( getUserWorkflowsSpy ).toHaveBeenCalledTimes( 1 );

                // check spy results
                expect( spyResult.isSuccess() ).toBe( true );

                // check result
                expect( result.body ).toStrictEqual( {
                    workflows: [
                        {
                            id: workflowId1
                            , name: 'Test Workflow'
                            , description: null
                            , version: null
                            , updatedAt: '2024-01-01T00:00:00Z'
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
            'returns 500 GET_WORKFLOWS_FAILED when user not found in database'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';

                // create spys
                const getUserWorkflowsSpy = jest.spyOn( WorkflowsService, 'getUserWorkflows' );

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

                postGraphileRequest.mockResponseOnce( { userById: null } );

                // send request
                const result = await request
                    .get( `/api/users/${ sessionUserId }/workflows` );

                // get spy results
                const spyResult = await getUserWorkflowsSpy.mock.results[ 0 ].value;

                // check times called
                expect( getUserWorkflowsSpy ).toHaveBeenCalledTimes( 1 );

                // check spy results
                expect( spyResult.isError() ).toBe( true );

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'GET_WORKFLOWS_FAILED'
                    , statusCode: 500
                } );

                // check status code
                expect( result.status ).toBe( 500 );

            }
        );

    } );

    describe( 'edge cases', () => {

        it(
            'filters out null workflows from nodes array'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const workflowId1 = uuidv4();

                // create spys
                const getUserWorkflowsSpy = jest.spyOn( WorkflowsService, 'getUserWorkflows' );

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
                    userById: {
                        workflowsByUserId: {
                            nodes: [
                                null
                                , {
                                    id: workflowId1
                                    , name: 'Test Workflow'
                                    , description: null
                                    , updatedAt: '2024-01-01T00:00:00Z'
                                    , workflowVersionsByWorkflowId: { nodes: [] }
                                }
                                , null
                            ]
                        }
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/users/${ sessionUserId }/workflows` );

                // get spy results
                const spyResult = await getUserWorkflowsSpy.mock.results[ 0 ].value;

                // check times called
                expect( getUserWorkflowsSpy ).toHaveBeenCalledTimes( 1 );

                // check spy results
                expect( spyResult.isSuccess() ).toBe( true );

                // check result - should only have 1 workflow (nulls filtered)
                expect( result.body.workflows ).toHaveLength( 1 );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

    } );

} );
