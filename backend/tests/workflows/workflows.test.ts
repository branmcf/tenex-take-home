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

import * as WorkflowsService from '../../app/workflows/workflows.service';
import {
    WorkflowsNotFound
    , WorkflowNotFound
    , CreateWorkflowFailed
    , UpdateWorkflowFailed
    , DeleteWorkflowFailed
} from '../../app/workflows/workflows.errors';

// set up server for testing - supertest handles server lifecycle internally
const request = supertest( testApp );

/**
 * GET /api/workflows/:workflowId
 */
describe( 'GET /api/workflows/:workflowId', () => {

    beforeEach( async () => {
        jest.clearAllMocks();
    } );

    describe( 'returns authentication errors', () => {

        it(
            'returns 401 UNAUTHORIZED when no session is provided'
            , async () => {

                // create test specific data
                const workflowId = uuidv4();

                // create spys - NONE

                // create mocks
                mockNoSessionOnce();

                // send request
                const result = await request
                    .get( `/api/workflows/${ workflowId }` );

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
            'returns 403 WORKFLOW_ACCESS_DENIED when workflow does not belong to user'
            , async () => {

                // create test specific data
                const sessionUserId = 'session-user-id';
                const workflowId = uuidv4();
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

                /*
                 * mock workflow ownership query (for
                 * workflowOwnershipValidator)
                 */
                postGraphileRequest.mockResponseOnce( {
                    workflowById: {
                        id: workflowId
                        , userId: otherUserId
                        , deletedAt: null
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/workflows/${ workflowId }` );

                // get spy results - NONE

                // check times called - NONE

                // check called with - NONE

                // check spy results - NONE

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'WORKFLOW_ACCESS_DENIED'
                    , statusCode: 403
                } );

                // check status code
                expect( result.status ).toBe( 403 );

            }
        );

    } );

    describe( 'the request to endpoint is invalid', () => {

        it(
            'returns 400 when workflowId is not a valid UUID'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const invalidWorkflowId = 'not-a-uuid';

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
                    .get( `/api/workflows/${ invalidWorkflowId }` );

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
            'returns 200 with workflow details'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const workflowId = uuidv4();

                // create spys
                const getWorkflowByIdSpy = jest.spyOn( WorkflowsService, 'getWorkflowById' );

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

                // mock ownership check
                postGraphileRequest.mockResponseOnce( {
                    workflowById: {
                        id: workflowId
                        , userId: sessionUserId
                        , deletedAt: null
                    }
                } );

                // mock getWorkflowById
                postGraphileRequest.mockResponseOnce( {
                    workflowById: {
                        id: workflowId
                        , name: 'Test Workflow'
                        , description: 'A test workflow'
                        , nameSource: 'user'
                        , descriptionSource: 'user'
                        , createdAt: '2024-01-01T00:00:00Z'
                        , updatedAt: '2024-01-02T00:00:00Z'
                        , deletedAt: null
                        , workflowVersionsByWorkflowId: {
                            nodes: [
                                {
                                    id: uuidv4()
                                    , versionNumber: 1
                                    , dag: {
                                        steps: [
                                            {
                                                id: 'step-1'
                                                , name: 'Step 1'
                                                , instruction: 'Do something'
                                                , tools: []
                                                , dependsOn: []
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
                    .get( `/api/workflows/${ workflowId }` );

                // get spy results
                const spyResult = await getWorkflowByIdSpy.mock.results[ 0 ].value;

                // check times called
                expect( getWorkflowByIdSpy ).toHaveBeenCalledTimes( 1 );

                // check called with
                expect( getWorkflowByIdSpy ).toHaveBeenCalledWith( workflowId );

                // check spy results
                expect( spyResult.isSuccess() ).toBe( true );

                // check result
                expect( result.body.workflow ).toMatchObject( {
                    id: workflowId
                    , name: 'Test Workflow'
                    , description: 'A test workflow'
                    , version: 1
                } );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

        it(
            'returns 200 with workflow without versions'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const workflowId = uuidv4();

                // create spys
                const getWorkflowByIdSpy = jest.spyOn( WorkflowsService, 'getWorkflowById' );

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

                // mock ownership check
                postGraphileRequest.mockResponseOnce( {
                    workflowById: {
                        id: workflowId
                        , userId: sessionUserId
                        , deletedAt: null
                    }
                } );

                // mock getWorkflowById
                postGraphileRequest.mockResponseOnce( {
                    workflowById: {
                        id: workflowId
                        , name: 'New Workflow'
                        , description: null
                        , nameSource: 'auto'
                        , descriptionSource: 'auto'
                        , createdAt: '2024-01-01T00:00:00Z'
                        , updatedAt: '2024-01-01T00:00:00Z'
                        , deletedAt: null
                        , workflowVersionsByWorkflowId: { nodes: [] }
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/workflows/${ workflowId }` );

                // get spy results
                const spyResult = await getWorkflowByIdSpy.mock.results[ 0 ].value;

                // check times called
                expect( getWorkflowByIdSpy ).toHaveBeenCalledTimes( 1 );

                // check spy results
                expect( spyResult.isSuccess() ).toBe( true );

                // check result
                expect( result.body.workflow ).toMatchObject( {
                    id: workflowId
                    , name: 'New Workflow'
                    , description: null
                    , version: null
                    , steps: []
                } );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

    } );

    describe( 'service layer errors', () => {

        it(
            'returns 404 WORKFLOW_NOT_FOUND when workflow does not exist'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const workflowId = uuidv4();

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

                // mock ownership check - workflow not found
                postGraphileRequest.mockResponseOnce( { workflowById: null } );

                // send request
                const result = await request
                    .get( `/api/workflows/${ workflowId }` );

                // get spy results - NONE

                // check times called - NONE

                // check called with - NONE

                // check spy results - NONE

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'WORKFLOW_NOT_FOUND'
                    , statusCode: 404
                } );

                // check status code
                expect( result.status ).toBe( 404 );

            }
        );

    } );

} );

/**
 * POST /api/workflows
 */
describe( 'POST /api/workflows', () => {

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
                    .post( '/api/workflows' )
                    .send( {
                        userId: 'test-user-id'
                        , name: 'Test Workflow'
                    } );

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
            'returns 400 when name is missing'
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
                    .post( '/api/workflows' )
                    .send( { userId: sessionUserId } );

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

        it(
            'returns 400 when userId is missing'
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
                    .post( '/api/workflows' )
                    .send( { name: 'Test Workflow' } );

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
            'returns 201 with created workflow'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const workflowId = uuidv4();

                // create spys
                const createWorkflowSpy = jest.spyOn( WorkflowsService, 'createWorkflow' );

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

                // mock createWorkflow
                postGraphileRequest.mockResponseOnce( {
                    createWorkflow: {
                        workflow: {
                            id: workflowId
                            , name: 'Test Workflow'
                            , description: 'A test workflow'
                            , createdAt: '2024-01-01T00:00:00Z'
                            , updatedAt: '2024-01-01T00:00:00Z'
                        }
                    }
                } );

                // send request
                const result = await request
                    .post( '/api/workflows' )
                    .send( {
                        userId: sessionUserId
                        , name: 'Test Workflow'
                        , description: 'A test workflow'
                    } );

                // get spy results
                const spyResult = await createWorkflowSpy.mock.results[ 0 ].value;

                // check times called
                expect( createWorkflowSpy ).toHaveBeenCalledTimes( 1 );

                // check called with
                expect( createWorkflowSpy ).toHaveBeenCalledWith( {
                    userId: sessionUserId
                    , name: 'Test Workflow'
                    , description: 'A test workflow'
                } );

                // check spy results
                expect( spyResult.isSuccess() ).toBe( true );

                // check result
                expect( result.body.workflow ).toMatchObject( {
                    id: workflowId
                    , name: 'Test Workflow'
                    , description: 'A test workflow'
                    , version: null
                } );

                // check status code
                expect( result.status ).toBe( 201 );

            }
        );

    } );

    describe( 'service layer errors', () => {

        it(
            'returns 500 CREATE_WORKFLOW_FAILED when creation fails'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';

                // create spys
                const createWorkflowSpy = jest.spyOn( WorkflowsService, 'createWorkflow' );

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

                // mock createWorkflow failure
                postGraphileRequest.mockResponseOnce( { createWorkflow: null } );

                // send request
                const result = await request
                    .post( '/api/workflows' )
                    .send( {
                        userId: sessionUserId
                        , name: 'Test Workflow'
                    } );

                // get spy results
                const spyResult = await createWorkflowSpy.mock.results[ 0 ].value;

                // check times called
                expect( createWorkflowSpy ).toHaveBeenCalledTimes( 1 );

                // check spy results
                expect( spyResult.isError() ).toBe( true );

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'CREATE_WORKFLOW_FAILED'
                    , statusCode: 500
                } );

                // check status code
                expect( result.status ).toBe( 500 );

            }
        );

    } );

} );

/**
 * PATCH /api/workflows/:workflowId
 */
describe( 'PATCH /api/workflows/:workflowId', () => {

    beforeEach( async () => {
        jest.clearAllMocks();
    } );

    describe( 'returns authentication errors', () => {

        it(
            'returns 401 UNAUTHORIZED when no session is provided'
            , async () => {

                // create test specific data
                const workflowId = uuidv4();

                // create spys - NONE

                // create mocks
                mockNoSessionOnce();

                // send request
                const result = await request
                    .patch( `/api/workflows/${ workflowId }` )
                    .send( { name: 'Updated Workflow' } );

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
            'returns 400 when neither name nor description is provided'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const workflowId = uuidv4();

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
                    .patch( `/api/workflows/${ workflowId }` )
                    .send( {} );

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
            'returns 200 with updated workflow when updating name'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const workflowId = uuidv4();

                // create spys
                const updateWorkflowSpy = jest.spyOn( WorkflowsService, 'updateWorkflow' );

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

                // mock ownership check
                postGraphileRequest.mockResponseOnce( {
                    workflowById: {
                        id: workflowId
                        , userId: sessionUserId
                        , deletedAt: null
                    }
                } );

                // mock updateWorkflow
                postGraphileRequest.mockResponseOnce( {
                    updateWorkflowById: {
                        workflow: {
                            id: workflowId
                            , name: 'Updated Workflow'
                            , description: 'Original description'
                            , updatedAt: '2024-01-02T00:00:00Z'
                        }
                    }
                } );

                // send request
                const result = await request
                    .patch( `/api/workflows/${ workflowId }` )
                    .send( { name: 'Updated Workflow' } );

                // get spy results
                const spyResult = await updateWorkflowSpy.mock.results[ 0 ].value;

                // check times called
                expect( updateWorkflowSpy ).toHaveBeenCalledTimes( 1 );

                // check spy results
                expect( spyResult.isSuccess() ).toBe( true );

                // check result
                expect( result.body.workflow ).toMatchObject( {
                    id: workflowId
                    , name: 'Updated Workflow'
                } );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

    } );

} );

/**
 * DELETE /api/workflows/:workflowId
 */
describe( 'DELETE /api/workflows/:workflowId', () => {

    beforeEach( async () => {
        jest.clearAllMocks();
    } );

    describe( 'returns authentication errors', () => {

        it(
            'returns 401 UNAUTHORIZED when no session is provided'
            , async () => {

                // create test specific data
                const workflowId = uuidv4();

                // create spys - NONE

                // create mocks
                mockNoSessionOnce();

                // send request
                const result = await request
                    .delete( `/api/workflows/${ workflowId }` );

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
            'returns 200 with success when workflow is deleted'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const workflowId = uuidv4();

                // create spys
                const deleteWorkflowSpy = jest.spyOn( WorkflowsService, 'deleteWorkflow' );

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

                // mock ownership check
                postGraphileRequest.mockResponseOnce( {
                    workflowById: {
                        id: workflowId
                        , userId: sessionUserId
                        , deletedAt: null
                    }
                } );

                // mock getWorkflowById check inside deleteWorkflow
                postGraphileRequest.mockResponseOnce( {
                    workflowById: {
                        id: workflowId
                        , name: 'Test Workflow'
                        , description: null
                        , nameSource: 'auto'
                        , descriptionSource: 'auto'
                        , createdAt: '2024-01-01T00:00:00Z'
                        , updatedAt: '2024-01-01T00:00:00Z'
                        , deletedAt: null
                        , workflowVersionsByWorkflowId: { nodes: [] }
                    }
                } );

                // mock soft delete mutation
                postGraphileRequest.mockResponseOnce( {
                    updateWorkflowById: {
                        workflow: {
                            id: workflowId
                            , deletedAt: '2024-01-02T00:00:00Z'
                        }
                    }
                } );

                // send request
                const result = await request
                    .delete( `/api/workflows/${ workflowId }` );

                // get spy results
                const spyResult = await deleteWorkflowSpy.mock.results[ 0 ].value;

                // check times called
                expect( deleteWorkflowSpy ).toHaveBeenCalledTimes( 1 );

                // check called with
                expect( deleteWorkflowSpy ).toHaveBeenCalledWith( workflowId );

                // check spy results
                expect( spyResult.isSuccess() ).toBe( true );

                // check result
                expect( result.body ).toStrictEqual( { success: true } );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

    } );

    describe( 'service layer errors', () => {

        it(
            'returns 404 WORKFLOW_NOT_FOUND when workflow is already deleted'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const workflowId = uuidv4();

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

                // mock ownership check - workflow already deleted
                postGraphileRequest.mockResponseOnce( {
                    workflowById: {
                        id: workflowId
                        , userId: sessionUserId
                        , deletedAt: '2024-01-01T00:00:00Z'
                    }
                } );

                // send request
                const result = await request
                    .delete( `/api/workflows/${ workflowId }` );

                // get spy results - NONE

                // check times called - NONE

                // check called with - NONE

                // check spy results - NONE

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'WORKFLOW_NOT_FOUND'
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
describe( 'workflows error classes', () => {

    it(
        'workflowsNotFound has correct properties'
        , () => {

            // create error instance
            const error = new WorkflowsNotFound();

            // check properties
            expect( error.clientMessage ).toBe( 'No workflows found.' );
            expect( error.code ).toBe( 'WORKFLOWS_NOT_FOUND' );
            expect( error.statusCode ).toBe( 404 );

        }
    );

    it(
        'workflowNotFound has correct properties'
        , () => {

            // create error instance
            const error = new WorkflowNotFound();

            // check properties
            expect( error.clientMessage ).toBe( 'Workflow not found.' );
            expect( error.code ).toBe( 'WORKFLOW_NOT_FOUND' );
            expect( error.statusCode ).toBe( 404 );

        }
    );

    it(
        'createWorkflowFailed has correct properties'
        , () => {

            // create error instance
            const error = new CreateWorkflowFailed();

            // check properties
            expect( error.clientMessage ).toBe( 'Failed to create workflow.' );
            expect( error.code ).toBe( 'CREATE_WORKFLOW_FAILED' );
            expect( error.statusCode ).toBe( 500 );

        }
    );

    it(
        'updateWorkflowFailed has correct properties'
        , () => {

            // create error instance
            const error = new UpdateWorkflowFailed();

            // check properties
            expect( error.clientMessage ).toBe( 'Failed to update workflow.' );
            expect( error.code ).toBe( 'UPDATE_WORKFLOW_FAILED' );
            expect( error.statusCode ).toBe( 500 );

        }
    );

    it(
        'deleteWorkflowFailed has correct properties'
        , () => {

            // create error instance
            const error = new DeleteWorkflowFailed();

            // check properties
            expect( error.clientMessage ).toBe( 'Failed to delete workflow.' );
            expect( error.code ).toBe( 'DELETE_WORKFLOW_FAILED' );
            expect( error.statusCode ).toBe( 500 );

        }
    );

} );
