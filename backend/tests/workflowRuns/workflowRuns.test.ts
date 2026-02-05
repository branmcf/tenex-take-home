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
import { v4 as uuidv4 } from 'uuid';

import * as WorkflowRunsService from '../../app/workflowRuns/workflowRuns.service';
import {
    WorkflowRunNotFound
    , WorkflowRunAccessForbidden
    , WorkflowRunStreamFailed
} from '../../app/workflowRuns/workflowRuns.errors';

// set up server for testing
const server = testApp.listen();
const request = supertest( server );

afterAll( async () => {
    server.close();
} );

/**
 * GET /api/chats/:chatId/workflow-runs
 */
describe( 'GET /api/chats/:chatId/workflow-runs', () => {

    beforeEach( async () => {
        jest.clearAllMocks();
    } );

    describe( 'returns authentication errors', () => {

        it(
            'returns 401 UNAUTHORIZED when no session is provided'
            , async () => {

                // create test specific data
                const chatId = uuidv4();

                // create spys - NONE

                // create mocks
                mockNoSessionOnce();

                // send request
                const result = await request
                    .get( `/api/chats/${ chatId }/workflow-runs` );

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
            'returns 403 CHAT_ACCESS_DENIED when chat does not belong to user'
            , async () => {

                // create test specific data
                const sessionUserId = 'session-user-id';
                const chatId = uuidv4();
                const otherUserId = 'other-user-id';

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

                // mock chat ownership query (for chatOwnershipValidator)
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , userId: otherUserId
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/chats/${ chatId }/workflow-runs` );

                // get spy results - NONE

                // check times called - NONE

                // check called with - NONE

                // check spy results - NONE

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'CHAT_ACCESS_DENIED'
                    , statusCode: 403
                } );

                // check status code
                expect( result.status ).toBe( 403 );

            }
        );

    } );

    // NOTE: Invalid UUID validation tests for chatId are not included because
    // the chatOwnershipValidator middleware runs before requestValidator
    // in this route configuration. Invalid UUIDs result in ownership check failures
    // rather than request validation errors.

    describe( 'the request to endpoint is valid', () => {

        it(
            'returns 200 with workflow runs array'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const chatId = uuidv4();
                const workflowRunId = uuidv4();
                const triggerMessageId = uuidv4();

                // create spys
                const getWorkflowRunsByChatIdSpy = jest.spyOn( WorkflowRunsService, 'getWorkflowRunsByChatId' );

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

                // mock chat ownership check
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , userId: sessionUserId
                    }
                } );

                // mock getWorkflowRunsByChatId
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , workflowRunsByChatId: {
                            nodes: [
                                {
                                    id: workflowRunId
                                    , status: 'PASSED'
                                    , startedAt: '2024-01-01T00:00:00Z'
                                    , completedAt: '2024-01-01T00:01:00Z'
                                    , triggerMessageId
                                    , workflowVersionByWorkflowVersionId: {
                                        id: uuidv4()
                                        , dag: {
                                            steps: [
                                                {
                                                    id: 'step-1'
                                                    , name: 'Step 1'
                                                    , instruction: 'Do something'
                                                }
                                            ]
                                        }
                                    }
                                    , stepRunsByWorkflowRunId: {
                                        nodes: [
                                            {
                                                id: uuidv4()
                                                , stepId: 'step-1'
                                                , status: 'PASSED'
                                                , output: 'Success'
                                                , logs: null
                                                , toolCalls: null
                                                , error: null
                                                , startedAt: '2024-01-01T00:00:10Z'
                                                , completedAt: '2024-01-01T00:00:30Z'
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/chats/${ chatId }/workflow-runs` );

                // get spy results
                const spyResult = await getWorkflowRunsByChatIdSpy.mock.results[ 0 ].value;

                // check times called
                expect( getWorkflowRunsByChatIdSpy ).toHaveBeenCalledTimes( 1 );

                // check called with
                expect( getWorkflowRunsByChatIdSpy ).toHaveBeenCalledWith( chatId );

                // check spy results
                expect( spyResult.isSuccess() ).toBe( true );

                // check result
                expect( result.body.workflowRuns ).toHaveLength( 1 );
                expect( result.body.workflowRuns[ 0 ] ).toMatchObject( {
                    id: workflowRunId
                    , status: 'PASSED'
                    , triggerMessageId
                } );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

        it(
            'returns 200 with empty array when no workflow runs exist'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const chatId = uuidv4();

                // create spys
                const getWorkflowRunsByChatIdSpy = jest.spyOn( WorkflowRunsService, 'getWorkflowRunsByChatId' );

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

                // mock chat ownership check
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , userId: sessionUserId
                    }
                } );

                // mock getWorkflowRunsByChatId - chat not found returns empty array
                postGraphileRequest.mockResponseOnce( {
                    chatById: null
                } );

                // send request
                const result = await request
                    .get( `/api/chats/${ chatId }/workflow-runs` );

                // get spy results
                const spyResult = await getWorkflowRunsByChatIdSpy.mock.results[ 0 ].value;

                // check times called
                expect( getWorkflowRunsByChatIdSpy ).toHaveBeenCalledTimes( 1 );

                // check spy results
                expect( spyResult.isSuccess() ).toBe( true );
                expect( spyResult.value ).toStrictEqual( [] );

                // check result
                expect( result.body ).toStrictEqual( { workflowRuns: [] } );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

    } );

    describe( 'edge cases', () => {

        it(
            'filters out null workflow runs from nodes array'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const chatId = uuidv4();
                const workflowRunId = uuidv4();
                const triggerMessageId = uuidv4();

                // create spys
                const getWorkflowRunsByChatIdSpy = jest.spyOn( WorkflowRunsService, 'getWorkflowRunsByChatId' );

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

                // mock chat ownership check
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , userId: sessionUserId
                    }
                } );

                // mock getWorkflowRunsByChatId with null items
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , workflowRunsByChatId: {
                            nodes: [
                                null
                                , {
                                    id: workflowRunId
                                    , status: 'RUNNING'
                                    , startedAt: '2024-01-01T00:00:00Z'
                                    , completedAt: null
                                    , triggerMessageId
                                    , workflowVersionByWorkflowVersionId: null
                                    , stepRunsByWorkflowRunId: {
                                        nodes: []
                                    }
                                }
                                , null
                            ]
                        }
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/chats/${ chatId }/workflow-runs` );

                // get spy results
                const spyResult = await getWorkflowRunsByChatIdSpy.mock.results[ 0 ].value;

                // check times called
                expect( getWorkflowRunsByChatIdSpy ).toHaveBeenCalledTimes( 1 );

                // check spy results
                expect( spyResult.isSuccess() ).toBe( true );

                // check result - should only have 1 workflow run (nulls filtered)
                expect( result.body.workflowRuns ).toHaveLength( 1 );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

    } );

} );

/**
 * GET /api/chats/:chatId/workflow-runs/:workflowRunId/stream
 */
describe( 'GET /api/chats/:chatId/workflow-runs/:workflowRunId/stream', () => {

    beforeEach( async () => {
        jest.clearAllMocks();
    } );

    describe( 'returns authentication errors', () => {

        it(
            'returns 401 UNAUTHORIZED when no session is provided'
            , async () => {

                // create test specific data
                const chatId = uuidv4();
                const workflowRunId = uuidv4();

                // create spys - NONE

                // create mocks
                mockNoSessionOnce();

                // send request
                const result = await request
                    .get( `/api/chats/${ chatId }/workflow-runs/${ workflowRunId }/stream` );

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

    describe( 'the request to endpoint is invalid', () => {

        it(
            'returns 400 when workflowRunId is not a valid UUID'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const chatId = uuidv4();
                const invalidWorkflowRunId = 'not-a-uuid';

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

                // mock chat ownership check
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , userId: sessionUserId
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/chats/${ chatId }/workflow-runs/${ invalidWorkflowRunId }/stream` );

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

} );

/**
 * Error classes unit tests
 */
describe( 'workflowRuns error classes', () => {

    it(
        'WorkflowRunNotFound has correct properties'
        , () => {

            // create error instance
            const error = new WorkflowRunNotFound();

            // check properties
            expect( error.clientMessage ).toBe( 'Workflow run not found.' );
            expect( error.code ).toBe( 'WORKFLOW_RUN_NOT_FOUND' );
            expect( error.statusCode ).toBe( 404 );

        }
    );

    it(
        'WorkflowRunAccessForbidden has correct properties'
        , () => {

            // create error instance
            const error = new WorkflowRunAccessForbidden();

            // check properties
            expect( error.clientMessage ).toBe( 'You do not have access to this workflow run.' );
            expect( error.code ).toBe( 'WORKFLOW_RUN_ACCESS_FORBIDDEN' );
            expect( error.statusCode ).toBe( 403 );

        }
    );

    it(
        'WorkflowRunStreamFailed has correct properties'
        , () => {

            // create error instance
            const error = new WorkflowRunStreamFailed();

            // check properties
            expect( error.clientMessage ).toBe( 'Failed to stream workflow run.' );
            expect( error.code ).toBe( 'WORKFLOW_RUN_STREAM_FAILED' );
            expect( error.statusCode ).toBe( 500 );

        }
    );

} );
