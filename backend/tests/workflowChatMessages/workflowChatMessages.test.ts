/* ----------------- Mocks ----------------------- */

import { postGraphileRequest } from '../../lib/postGraphile/__mocks__/postGraphile.request';
import {
    mockSessionOnce
    , mockNoSessionOnce
} from '../../lib/betterAuth/__mocks__/auth';

/* ----------------- Mocks ----------------------- */

// Mock workflow proposals module
jest.mock( '../../lib/workflowProposals', () => ( {
    getWorkflowProposal: jest.fn()
    , getWorkflowProposalsByWorkflowId: jest.fn()
    , updateWorkflowProposalStatus: jest.fn()
} ) );

// Mock workflow chat messages helper
jest.mock( '../../app/workflowChatMessages/workflowChatMessages.helper', () => ( { generateWorkflowChatResponse: jest.fn() } ) );

import supertest from 'supertest';
import { testApp } from '../tests.server';
import { v4 as uuidv4 } from 'uuid';

import * as WorkflowChatMessagesService from '../../app/workflowChatMessages/workflowChatMessages.service';
import * as WorkflowProposals from '../../lib/workflowProposals';
import * as WorkflowChatMessagesHelper from '../../app/workflowChatMessages/workflowChatMessages.helper';
import { success, error } from '../../types';
import { ResourceError } from '../../errors';
import {
    WorkflowChatMessagesNotFound
    , GetWorkflowChatMessagesFailed
    , CreateWorkflowChatMessageFailed
    , WorkflowProposalVersionMismatch
    , WorkflowProposalApplyFailed
    , WorkflowProposalRejectFailed
} from '../../app/workflowChatMessages/workflowChatMessages.errors';

// set up server for testing - supertest handles server lifecycle internally
const request = supertest( testApp );

/**
 * GET /api/workflows/:workflowId/messages
 */
describe( 'GET /api/workflows/:workflowId/messages', () => {

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
                    .get( `/api/workflows/${ workflowId }/messages` );

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

                // mock workflow ownership query
                postGraphileRequest.mockResponseOnce( {
                    workflowById: {
                        id: workflowId
                        , userId: otherUserId
                        , deletedAt: null
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/workflows/${ workflowId }/messages` );

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

    /*
     * NOTE: Invalid UUID validation tests are not included for workflowId
     * because the workflowOwnershipValidator middleware runs before
     * requestValidator
     * in this route configuration. Invalid UUIDs result in ownership check
     * failures
     * rather than request validation errors.
     */

    describe( 'the request to endpoint is valid', () => {

        it(
            'returns 200 with messages array and pending proposal'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const workflowId = uuidv4();
                const messageId = uuidv4();
                const proposalId = uuidv4();

                // create spys
                const getWorkflowChatMessagesSpy = jest.spyOn( WorkflowChatMessagesService, 'getWorkflowChatMessages' );

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

                // mock workflow ownership check
                postGraphileRequest.mockResponseOnce( {
                    workflowById: {
                        id: workflowId
                        , userId: sessionUserId
                        , deletedAt: null
                    }
                } );

                // mock getWorkflowChatMessages
                postGraphileRequest.mockResponseOnce( {
                    workflowById: {
                        id: workflowId
                        , workflowChatMessagesByWorkflowId: {
                            nodes: [
                                {
                                    id: messageId
                                    , role: 'USER'
                                    , content: 'Hello'
                                    , createdAt: '2024-01-01T00:00:00Z'
                                }
                            ]
                        }
                    }
                } );

                // mock getWorkflowProposalsByWorkflowId
                ( WorkflowProposals.getWorkflowProposalsByWorkflowId as jest.Mock ).mockResolvedValueOnce(
                    success( [
                        {
                            id: proposalId
                            , workflowId
                            , baseVersionId: null
                            , toolCalls: []
                            , proposedDag: { steps: [] }
                            , status: 'pending'
                            , createdAt: '2024-01-01T00:00:00Z'
                            , expiresAt: new Date( Date.now() + ( 60 * 60 * 1000 ) ).toISOString()
                        }
                    ] )
                );

                // mock getLatestWorkflowVersion
                postGraphileRequest.mockResponseOnce( {
                    workflowById: {
                        id: workflowId
                        , workflowVersionsByWorkflowId: { nodes: [] }
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/workflows/${ workflowId }/messages` );

                // get spy results
                const spyResult = await getWorkflowChatMessagesSpy.mock.results[ 0 ].value;

                // check times called
                expect( getWorkflowChatMessagesSpy ).toHaveBeenCalledTimes( 1 );

                // check called with
                expect( getWorkflowChatMessagesSpy ).toHaveBeenCalledWith( workflowId );

                // check spy results
                expect( spyResult.isSuccess() ).toBe( true );

                // check result
                expect( result.body.messages ).toHaveLength( 1 );
                expect( result.body.messages[ 0 ] ).toMatchObject( {
                    id: messageId
                    , role: 'user'
                    , content: 'Hello'
                } );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

        it(
            'returns 200 with empty messages array when no messages exist'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const workflowId = uuidv4();

                // create spys
                const getWorkflowChatMessagesSpy = jest.spyOn( WorkflowChatMessagesService, 'getWorkflowChatMessages' );

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

                // mock workflow ownership check
                postGraphileRequest.mockResponseOnce( {
                    workflowById: {
                        id: workflowId
                        , userId: sessionUserId
                        , deletedAt: null
                    }
                } );

                // mock getWorkflowChatMessages with empty messages
                postGraphileRequest.mockResponseOnce( {
                    workflowById: {
                        id: workflowId
                        , workflowChatMessagesByWorkflowId: { nodes: [] }
                    }
                } );

                // mock getWorkflowProposalsByWorkflowId
                ( WorkflowProposals.getWorkflowProposalsByWorkflowId as jest.Mock ).mockResolvedValueOnce(
                    success( [] )
                );

                // mock getLatestWorkflowVersion
                postGraphileRequest.mockResponseOnce( {
                    workflowById: {
                        id: workflowId
                        , workflowVersionsByWorkflowId: { nodes: [] }
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/workflows/${ workflowId }/messages` );

                // get spy results
                const spyResult = await getWorkflowChatMessagesSpy.mock.results[ 0 ].value;

                // check times called
                expect( getWorkflowChatMessagesSpy ).toHaveBeenCalledTimes( 1 );

                // check spy results
                expect( spyResult.isSuccess() ).toBe( true );

                // check result
                expect( result.body.messages ).toHaveLength( 0 );
                expect( result.body.pendingProposal ).toBeNull();

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

    } );

    describe( 'service layer errors', () => {

        it(
            'returns 500 when getWorkflowChatMessages fails'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const workflowId = uuidv4();

                // create spys
                const getWorkflowChatMessagesSpy = jest.spyOn( WorkflowChatMessagesService, 'getWorkflowChatMessages' );

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

                // mock workflow ownership check
                postGraphileRequest.mockResponseOnce( {
                    workflowById: {
                        id: workflowId
                        , userId: sessionUserId
                        , deletedAt: null
                    }
                } );

                // mock getWorkflowChatMessages failure (workflow not found)
                postGraphileRequest.mockResponseOnce( { workflowById: null } );

                // send request
                const result = await request
                    .get( `/api/workflows/${ workflowId }/messages` );

                // get spy results
                const spyResult = await getWorkflowChatMessagesSpy.mock.results[ 0 ].value;

                // check times called
                expect( getWorkflowChatMessagesSpy ).toHaveBeenCalledTimes( 1 );

                // check spy results
                expect( spyResult.isError() ).toBe( true );

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'GET_WORKFLOW_CHAT_MESSAGES_FAILED'
                    , statusCode: 500
                } );

                // check status code
                expect( result.status ).toBe( 500 );

            }
        );

    } );

} );

/**
 * POST /api/workflows/:workflowId/messages
 */
describe( 'POST /api/workflows/:workflowId/messages', () => {

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
                    .post( `/api/workflows/${ workflowId }/messages` )
                    .send( {
                        content: 'Test message'
                        , modelId: 'gpt-4o'
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
            'returns 400 when content is missing'
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

                // mock workflow ownership check
                postGraphileRequest.mockResponseOnce( {
                    workflowById: {
                        id: workflowId
                        , userId: sessionUserId
                        , deletedAt: null
                    }
                } );

                // send request
                const result = await request
                    .post( `/api/workflows/${ workflowId }/messages` )
                    .send( { modelId: 'gpt-4o' } );

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
            'returns 400 when modelId is missing'
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

                // mock workflow ownership check
                postGraphileRequest.mockResponseOnce( {
                    workflowById: {
                        id: workflowId
                        , userId: sessionUserId
                        , deletedAt: null
                    }
                } );

                // send request
                const result = await request
                    .post( `/api/workflows/${ workflowId }/messages` )
                    .send( { content: 'Test message' } );

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
            'returns 201 with user and assistant messages on success'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const workflowId = uuidv4();
                const userMessageId = uuidv4();
                const assistantMessageId = uuidv4();

                // create spys
                const createWorkflowChatMessageSpy = jest.spyOn( WorkflowChatMessagesService, 'createWorkflowChatMessage' );

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

                // mock workflow ownership check
                postGraphileRequest.mockResponseOnce( {
                    workflowById: {
                        id: workflowId
                        , userId: sessionUserId
                        , deletedAt: null
                    }
                } );

                // mock createWorkflowChatMessage for user message
                postGraphileRequest.mockResponseOnce( {
                    createWorkflowChatMessage: {
                        workflowChatMessage: {
                            id: userMessageId
                            , role: 'USER'
                            , content: 'Test message'
                            , createdAt: '2024-01-01T00:00:00Z'
                        }
                    }
                } );

                // mock generateWorkflowChatResponse
                ( WorkflowChatMessagesHelper.generateWorkflowChatResponse as jest.Mock ).mockResolvedValueOnce(
                    success( {
                        content: 'Response from assistant'
                        , proposedChanges: null
                    } )
                );

                // mock createWorkflowChatMessage for assistant message
                postGraphileRequest.mockResponseOnce( {
                    createWorkflowChatMessage: {
                        workflowChatMessage: {
                            id: assistantMessageId
                            , role: 'ASSISTANT'
                            , content: 'Response from assistant'
                            , createdAt: '2024-01-01T00:00:01Z'
                        }
                    }
                } );

                // send request
                const result = await request
                    .post( `/api/workflows/${ workflowId }/messages` )
                    .send( {
                        content: 'Test message'
                        , modelId: 'gpt-4o'
                    } );

                // get spy results
                const spyResult = await createWorkflowChatMessageSpy.mock.results[ 0 ].value;

                // check times called
                expect( createWorkflowChatMessageSpy ).toHaveBeenCalledTimes( 2 );

                // check spy results
                expect( spyResult.isSuccess() ).toBe( true );

                // check result
                expect( result.body.userMessage ).toMatchObject( {
                    id: userMessageId
                    , role: 'user'
                    , content: 'Test message'
                } );
                expect( result.body.assistantMessage ).toMatchObject( {
                    id: assistantMessageId
                    , role: 'assistant'
                    , content: 'Response from assistant'
                } );

                // check status code
                expect( result.status ).toBe( 201 );

            }
        );

        it(
            'returns 201 with partial response when LLM fails'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const workflowId = uuidv4();
                const userMessageId = uuidv4();

                // create spys
                const createWorkflowChatMessageSpy = jest.spyOn( WorkflowChatMessagesService, 'createWorkflowChatMessage' );

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

                // mock workflow ownership check
                postGraphileRequest.mockResponseOnce( {
                    workflowById: {
                        id: workflowId
                        , userId: sessionUserId
                        , deletedAt: null
                    }
                } );

                // mock createWorkflowChatMessage for user message
                postGraphileRequest.mockResponseOnce( {
                    createWorkflowChatMessage: {
                        workflowChatMessage: {
                            id: userMessageId
                            , role: 'USER'
                            , content: 'Test message'
                            , createdAt: '2024-01-01T00:00:00Z'
                        }
                    }
                } );

                // mock generateWorkflowChatResponse failure
                ( WorkflowChatMessagesHelper.generateWorkflowChatResponse as jest.Mock ).mockResolvedValueOnce(
                    error( new ResourceError( {
                        message: 'LLM failed'
                        , code: 'LLM_ERROR'
                        , statusCode: 500
                    } ) )
                );

                // send request
                const result = await request
                    .post( `/api/workflows/${ workflowId }/messages` )
                    .send( {
                        content: 'Test message'
                        , modelId: 'gpt-4o'
                    } );

                // get spy results
                const spyResult = await createWorkflowChatMessageSpy.mock.results[ 0 ].value;

                // check times called
                expect( createWorkflowChatMessageSpy ).toHaveBeenCalledTimes( 1 );

                // check spy results
                expect( spyResult.isSuccess() ).toBe( true );

                // check result
                expect( result.body.userMessage ).toMatchObject( {
                    id: userMessageId
                    , role: 'user'
                } );
                expect( result.body.assistantMessage ).toBeNull();
                expect( result.body.error ).toMatchObject( { code: 'LLM_ERROR' } );

                // check status code
                expect( result.status ).toBe( 201 );

            }
        );

    } );

} );

/**
 * POST /api/workflows/:workflowId/messages/apply
 */
describe( 'POST /api/workflows/:workflowId/messages/apply', () => {

    beforeEach( async () => {
        jest.clearAllMocks();
    } );

    describe( 'returns authentication errors', () => {

        it(
            'returns 401 UNAUTHORIZED when no session is provided'
            , async () => {

                // create test specific data
                const workflowId = uuidv4();
                const proposalId = uuidv4();

                // create spys - NONE

                // create mocks
                mockNoSessionOnce();

                // send request
                const result = await request
                    .post( `/api/workflows/${ workflowId }/messages/apply` )
                    .send( { proposalId } );

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
            'returns 400 when proposalId is missing'
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

                // mock workflow ownership check
                postGraphileRequest.mockResponseOnce( {
                    workflowById: {
                        id: workflowId
                        , userId: sessionUserId
                        , deletedAt: null
                    }
                } );

                // send request
                const result = await request
                    .post( `/api/workflows/${ workflowId }/messages/apply` )
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

        it(
            'returns 400 when proposalId is not a valid UUID'
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

                // mock workflow ownership check
                postGraphileRequest.mockResponseOnce( {
                    workflowById: {
                        id: workflowId
                        , userId: sessionUserId
                        , deletedAt: null
                    }
                } );

                // send request
                const result = await request
                    .post( `/api/workflows/${ workflowId }/messages/apply` )
                    .send( { proposalId: 'not-a-uuid' } );

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
 * POST /api/workflows/:workflowId/messages/reject
 */
describe( 'POST /api/workflows/:workflowId/messages/reject', () => {

    beforeEach( async () => {
        jest.clearAllMocks();
    } );

    describe( 'returns authentication errors', () => {

        it(
            'returns 401 UNAUTHORIZED when no session is provided'
            , async () => {

                // create test specific data
                const workflowId = uuidv4();
                const proposalId = uuidv4();

                // create spys - NONE

                // create mocks
                mockNoSessionOnce();

                // send request
                const result = await request
                    .post( `/api/workflows/${ workflowId }/messages/reject` )
                    .send( { proposalId } );

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
            'returns 400 when proposalId is missing'
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

                // mock workflow ownership check
                postGraphileRequest.mockResponseOnce( {
                    workflowById: {
                        id: workflowId
                        , userId: sessionUserId
                        , deletedAt: null
                    }
                } );

                // send request
                const result = await request
                    .post( `/api/workflows/${ workflowId }/messages/reject` )
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

} );

/**
 * Error classes unit tests
 */
describe( 'workflowChatMessages error classes', () => {

    it(
        'workflowChatMessagesNotFound has correct properties'
        , () => {

            // create error instance
            const error = new WorkflowChatMessagesNotFound();

            // check properties
            expect( error.clientMessage ).toBe( 'No chat messages found for this workflow.' );
            expect( error.code ).toBe( 'WORKFLOW_CHAT_MESSAGES_NOT_FOUND' );
            expect( error.statusCode ).toBe( 404 );

        }
    );

    it(
        'getWorkflowChatMessagesFailed has correct properties'
        , () => {

            // create error instance
            const error = new GetWorkflowChatMessagesFailed();

            // check properties
            expect( error.clientMessage ).toBe( 'Failed to retrieve workflow chat messages.' );
            expect( error.code ).toBe( 'GET_WORKFLOW_CHAT_MESSAGES_FAILED' );
            expect( error.statusCode ).toBe( 500 );

        }
    );

    it(
        'createWorkflowChatMessageFailed has correct properties'
        , () => {

            // create error instance
            const error = new CreateWorkflowChatMessageFailed();

            // check properties
            expect( error.clientMessage ).toBe( 'Failed to create workflow chat message.' );
            expect( error.code ).toBe( 'CREATE_WORKFLOW_CHAT_MESSAGE_FAILED' );
            expect( error.statusCode ).toBe( 500 );

        }
    );

    it(
        'workflowProposalVersionMismatch has correct properties'
        , () => {

            // create error instance
            const error = new WorkflowProposalVersionMismatch();

            // check properties
            expect( error.clientMessage ).toBe( 'Workflow has changed since the proposal was created.' );
            expect( error.code ).toBe( 'WORKFLOW_PROPOSAL_VERSION_MISMATCH' );
            expect( error.statusCode ).toBe( 409 );

        }
    );

    it(
        'workflowProposalApplyFailed has correct properties'
        , () => {

            // create error instance
            const error = new WorkflowProposalApplyFailed();

            // check properties
            expect( error.clientMessage ).toBe( 'Failed to apply workflow proposal.' );
            expect( error.code ).toBe( 'WORKFLOW_PROPOSAL_APPLY_FAILED' );
            expect( error.statusCode ).toBe( 500 );

        }
    );

    it(
        'workflowProposalRejectFailed has correct properties'
        , () => {

            // create error instance
            const error = new WorkflowProposalRejectFailed();

            // check properties
            expect( error.clientMessage ).toBe( 'Failed to reject workflow proposal.' );
            expect( error.code ).toBe( 'WORKFLOW_PROPOSAL_REJECT_FAILED' );
            expect( error.statusCode ).toBe( 500 );

        }
    );

} );
