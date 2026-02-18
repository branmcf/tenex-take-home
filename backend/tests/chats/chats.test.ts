/* eslint-disable @stylistic/max-len */
/* eslint-disable @stylistic/no-mixed-operators */
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

import * as ChatsService from '../../app/chats/chats.service';
import { ResourceError } from '../../errors';
import {
    UserChatsNotFound
    , GetUserChatsFailed
    , ChatNotFound
    , DeleteChatFailed
} from '../../app/chats/chats.errors';

// set up server for testing - supertest handles server lifecycle internally
const request = supertest( testApp );

/**
 * GET /api/users/:userId/chats
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
                const userId = 'mock-user-id';

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
                    clientMessage: expect.any( String )
                    , code: 'UNAUTHORIZED'
                    , statusCode: 401
                } );

                // check status code
                expect( result.status ).toBe( 401 );

            }
        );

        it(
            'returns 401 UNAUTHORIZED when session has no user'
            , async () => {

                // create test specific data
                const userId = 'mock-user-id';

                // create spys - NONE

                // create mocks
                auth.api.getSession.mockResolvedValueOnce( { user: null } );

                // send request
                const result = await request
                    .get( `/api/users/${ userId }/chats` );

                // get spy results - NONE

                // check times called - NONE

                // check called with - NONE

                // check spy results - NONE

                // check result
                expect( result.body ).toMatchObject( {
                    clientMessage: expect.any( String )
                    , code: 'UNAUTHORIZED'
                    , statusCode: 401
                } );

                // check status code
                expect( result.status ).toBe( 401 );

            }
        );

    } );

    describe( 'returns authorization errors', () => {

        it(
            'returns 403 USER_ID_MISMATCH when userId does not match session user'
            , async () => {

                // create test specific data
                const userId = 'different-user-id';
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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/users/${ userId }/chats` );

                // get spy results - NONE

                // check times called - NONE

                // check called with - NONE

                // check spy results - NONE

                // check result
                expect( result.body ).toMatchObject( {
                    clientMessage: 'Access denied. You can only access your own resources.'
                    , code: 'USER_ID_MISMATCH'
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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                // send request - empty userId (using space that gets trimmed)
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

        it(
            'returns 400 when limit is not a positive integer'
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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/users/${ sessionUserId }/chats` )
                    .query( { limit: -5 } );

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
            'returns 400 when limit exceeds max value of 100'
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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/users/${ sessionUserId }/chats` )
                    .query( { limit: 101 } );

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
            'returns 400 when offset is negative'
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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/users/${ sessionUserId }/chats` )
                    .query( { offset: -1 } );

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
            'returns 400 when limit is not a number'
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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/users/${ sessionUserId }/chats` )
                    .query( { limit: 'abc' } );

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
            'returns 200 with empty chats array when user has no chats'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';

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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                postGraphileRequest.mockResponseOnce( {
                    userById: {
                        id: sessionUserId
                        , chatsByUserId: { nodes: [] }
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
                expect( result.body ).toStrictEqual( { chats: [] } );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

        it(
            'returns 200 with chats array when user has chats'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const chatId1 = uuidv4();
                const chatId2 = uuidv4();
                const messageId1 = uuidv4();
                const messageContent1 = 'Hello, this is my first message';
                const chatTitle1 = 'My first chat';
                const updatedAt1 = new Date().toISOString();
                const updatedAt2 = new Date( Date.now() - 3600000 ).toISOString();

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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                postGraphileRequest.mockResponseOnce( {
                    userById: {
                        id: sessionUserId
                        , chatsByUserId: {
                            nodes: [
                                {
                                    id: chatId1
                                    , title: chatTitle1
                                    , updatedAt: updatedAt1
                                    , deletedAt: null
                                    , messagesByChatId: {
                                        nodes: [
                                            {
                                                id: messageId1
                                                , content: messageContent1
                                            }
                                        ]
                                    }
                                }
                                , {
                                    id: chatId2
                                    , title: null
                                    , updatedAt: updatedAt2
                                    , deletedAt: null
                                    , messagesByChatId: { nodes: [] }
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

                // check result - snippet is not included in JSON when undefined
                expect( result.body ).toStrictEqual( {
                    chats: [
                        {
                            id: chatId1
                            , title: chatTitle1
                            , snippet: messageContent1
                            , updatedAt: updatedAt1
                        }
                        , {
                            id: chatId2
                            , title: null
                            , updatedAt: updatedAt2
                        }
                    ]
                } );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

        it(
            'returns 200 with chats filtered to exclude deleted chats'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const chatId1 = uuidv4();
                const chatId2 = uuidv4();
                const messageId1 = uuidv4();
                const messageContent1 = 'Active chat message';
                const updatedAt1 = new Date().toISOString();
                const updatedAt2 = new Date( Date.now() - 3600000 ).toISOString();
                const deletedAt2 = new Date().toISOString();

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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                postGraphileRequest.mockResponseOnce( {
                    userById: {
                        id: sessionUserId
                        , chatsByUserId: {
                            nodes: [
                                {
                                    id: chatId1
                                    , title: 'Active chat'
                                    , updatedAt: updatedAt1
                                    , deletedAt: null
                                    , messagesByChatId: {
                                        nodes: [
                                            {
                                                id: messageId1
                                                , content: messageContent1
                                            }
                                        ]
                                    }
                                }
                                , {
                                    id: chatId2
                                    , title: 'Deleted chat'
                                    , updatedAt: updatedAt2
                                    , deletedAt: deletedAt2
                                    , messagesByChatId: { nodes: [] }
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

                // check spy results
                expect( spyResult.isSuccess() ).toBe( true );

                // check result - only the non-deleted chat should be returned
                expect( result.body ).toStrictEqual( {
                    chats: [
                        {
                            id: chatId1
                            , title: 'Active chat'
                            , snippet: messageContent1
                            , updatedAt: updatedAt1
                        }
                    ]
                } );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

        it(
            'returns 200 with pagination parameters applied'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const chatId1 = uuidv4();
                const updatedAt1 = new Date().toISOString();
                const limit = 10;
                const offset = 5;

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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                postGraphileRequest.mockResponseOnce( {
                    userById: {
                        id: sessionUserId
                        , chatsByUserId: {
                            nodes: [
                                {
                                    id: chatId1
                                    , title: 'Paginated chat'
                                    , updatedAt: updatedAt1
                                    , deletedAt: null
                                    , messagesByChatId: { nodes: [] }
                                }
                            ]
                        }
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/users/${ sessionUserId }/chats` )
                    .query( { limit, offset } );

                // get spy results
                const spyResult = await getUserChatsSpy.mock.results[ 0 ].value;

                // check times called
                expect( getUserChatsSpy ).toHaveBeenCalledTimes( 1 );

                // check called with - pagination params should be passed
                expect( getUserChatsSpy ).toHaveBeenCalledWith( {
                    userId: sessionUserId
                    , limit
                    , offset
                } );

                // check spy results
                expect( spyResult.isSuccess() ).toBe( true );

                // check result - snippet is not included in JSON when undefined
                expect( result.body ).toStrictEqual( {
                    chats: [
                        {
                            id: chatId1
                            , title: 'Paginated chat'
                            , updatedAt: updatedAt1
                        }
                    ]
                } );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

        it(
            'returns 200 with offset 0 allowed'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';

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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                postGraphileRequest.mockResponseOnce( {
                    userById: {
                        id: sessionUserId
                        , chatsByUserId: { nodes: [] }
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/users/${ sessionUserId }/chats` )
                    .query( { offset: 0 } );

                // get spy results
                const spyResult = await getUserChatsSpy.mock.results[ 0 ].value;

                // check times called
                expect( getUserChatsSpy ).toHaveBeenCalledTimes( 1 );

                // check called with - offset 0 should be passed
                expect( getUserChatsSpy ).toHaveBeenCalledWith( {
                    userId: sessionUserId
                    , limit: undefined
                    , offset: 0
                } );

                // check spy results
                expect( spyResult.isSuccess() ).toBe( true );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

    } );

    describe( 'service layer errors', () => {

        it(
            'returns 500 GET_USER_CHATS_FAILED when userById returns null'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';

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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                postGraphileRequest.mockResponseOnce( { userById: null } );

                // send request
                const result = await request
                    .get( `/api/users/${ sessionUserId }/chats` );

                // get spy results
                const spyResult = await getUserChatsSpy.mock.results[ 0 ].value;

                // check times called
                expect( getUserChatsSpy ).toHaveBeenCalledTimes( 1 );

                // check spy results
                expect( spyResult.isError() ).toBe( true );

                // check result
                expect( result.body ).toMatchObject( {
                    clientMessage: 'Failed to retrieve user chats.'
                    , code: 'GET_USER_CHATS_FAILED'
                    , statusCode: 500
                } );

                // check status code
                expect( result.status ).toBe( 500 );

            }
        );

        it(
            'returns 404 USER_CHATS_NOT_FOUND when chatsByUserId.nodes is null'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';

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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                postGraphileRequest.mockResponseOnce( {
                    userById: {
                        id: sessionUserId
                        , chatsByUserId: { nodes: null }
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/users/${ sessionUserId }/chats` );

                // get spy results
                const spyResult = await getUserChatsSpy.mock.results[ 0 ].value;

                // check times called
                expect( getUserChatsSpy ).toHaveBeenCalledTimes( 1 );

                // check spy results
                expect( spyResult.isError() ).toBe( true );

                // check result
                expect( result.body ).toMatchObject( {
                    clientMessage: 'No chats found for user.'
                    , code: 'USER_CHATS_NOT_FOUND'
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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
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
                    .get( `/api/users/${ sessionUserId }/chats` );

                // get spy results
                const spyResult = await getUserChatsSpy.mock.results[ 0 ].value;

                // check times called
                expect( getUserChatsSpy ).toHaveBeenCalledTimes( 1 );

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
            'handles null chat nodes in the array gracefully'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const chatId1 = uuidv4();
                const updatedAt1 = new Date().toISOString();

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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                postGraphileRequest.mockResponseOnce( {
                    userById: {
                        id: sessionUserId
                        , chatsByUserId: {
                            nodes: [
                                null
                                , {
                                    id: chatId1
                                    , title: 'Valid chat'
                                    , updatedAt: updatedAt1
                                    , deletedAt: null
                                    , messagesByChatId: { nodes: [] }
                                }
                                , null
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

                // check spy results
                expect( spyResult.isSuccess() ).toBe( true );

                // check result - null chats should be filtered out, snippet not included when undefined
                expect( result.body ).toStrictEqual( {
                    chats: [
                        {
                            id: chatId1
                            , title: 'Valid chat'
                            , updatedAt: updatedAt1
                        }
                    ]
                } );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

        it(
            'handles chatsByUserId being undefined'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';

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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                postGraphileRequest.mockResponseOnce( {
                    userById: {
                        id: sessionUserId
                        , chatsByUserId: undefined
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/users/${ sessionUserId }/chats` );

                // get spy results
                const spyResult = await getUserChatsSpy.mock.results[ 0 ].value;

                // check times called
                expect( getUserChatsSpy ).toHaveBeenCalledTimes( 1 );

                // check spy results
                expect( spyResult.isError() ).toBe( true );

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'USER_CHATS_NOT_FOUND'
                    , statusCode: 404
                } );

                // check status code
                expect( result.status ).toBe( 404 );

            }
        );

        it(
            'handles messagesByChatId being undefined'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const chatId1 = uuidv4();
                const updatedAt1 = new Date().toISOString();

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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                postGraphileRequest.mockResponseOnce( {
                    userById: {
                        id: sessionUserId
                        , chatsByUserId: {
                            nodes: [
                                {
                                    id: chatId1
                                    , title: 'Chat without messages'
                                    , updatedAt: updatedAt1
                                    , deletedAt: null
                                    , messagesByChatId: undefined
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

                // check spy results
                expect( spyResult.isSuccess() ).toBe( true );

                // check result - snippet not included in JSON when undefined
                expect( result.body ).toStrictEqual( {
                    chats: [
                        {
                            id: chatId1
                            , title: 'Chat without messages'
                            , updatedAt: updatedAt1
                        }
                    ]
                } );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

        it(
            'handles messages nodes being undefined'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const chatId1 = uuidv4();
                const updatedAt1 = new Date().toISOString();

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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                postGraphileRequest.mockResponseOnce( {
                    userById: {
                        id: sessionUserId
                        , chatsByUserId: {
                            nodes: [
                                {
                                    id: chatId1
                                    , title: 'Chat with undefined messages nodes'
                                    , updatedAt: updatedAt1
                                    , deletedAt: null
                                    , messagesByChatId: { nodes: undefined }
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

                // check spy results
                expect( spyResult.isSuccess() ).toBe( true );

                // check result - snippet not included in JSON when undefined
                expect( result.body ).toStrictEqual( {
                    chats: [
                        {
                            id: chatId1
                            , title: 'Chat with undefined messages nodes'
                            , updatedAt: updatedAt1
                        }
                    ]
                } );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

        it(
            'handles limit at maximum allowed value (100)'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';

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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                postGraphileRequest.mockResponseOnce( {
                    userById: {
                        id: sessionUserId
                        , chatsByUserId: { nodes: [] }
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/users/${ sessionUserId }/chats` )
                    .query( { limit: 100 } );

                // get spy results
                const spyResult = await getUserChatsSpy.mock.results[ 0 ].value;

                // check times called
                expect( getUserChatsSpy ).toHaveBeenCalledTimes( 1 );

                // check called with
                expect( getUserChatsSpy ).toHaveBeenCalledWith( {
                    userId: sessionUserId
                    , limit: 100
                    , offset: undefined
                } );

                // check spy results
                expect( spyResult.isSuccess() ).toBe( true );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

    } );

} );

/**
 * DELETE /api/chats/:chatId
 */
describe( 'DELETE /api/chats/:chatId', () => {

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
                    .delete( `/api/chats/${ chatId }` );

                // get spy results - NONE

                // check times called - NONE

                // check called with - NONE

                // check spy results - NONE

                // check result
                expect( result.body ).toMatchObject( {
                    clientMessage: expect.any( String )
                    , code: 'UNAUTHORIZED'
                    , statusCode: 401
                } );

                // check status code
                expect( result.status ).toBe( 401 );

            }
        );

        it(
            'returns 401 UNAUTHORIZED when session has no user'
            , async () => {

                // create test specific data
                const chatId = uuidv4();

                // create spys - NONE

                // create mocks
                auth.api.getSession.mockResolvedValueOnce( { user: null } );

                // send request
                const result = await request
                    .delete( `/api/chats/${ chatId }` );

                // get spy results - NONE

                // check times called - NONE

                // check called with - NONE

                // check spy results - NONE

                // check result
                expect( result.body ).toMatchObject( {
                    clientMessage: expect.any( String )
                    , code: 'UNAUTHORIZED'
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
                const chatId = uuidv4();
                const sessionUserId = 'mock-user-id';
                const differentUserId = 'different-user-id';

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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                // mock getChatOwnership to return a different user
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , userId: differentUserId
                        , deletedAt: null
                    }
                } );

                // send request
                const result = await request
                    .delete( `/api/chats/${ chatId }` );

                // get spy results - NONE

                // check times called - NONE

                // check called with - NONE

                // check spy results - NONE

                // check result
                expect( result.body ).toMatchObject( {
                    clientMessage: 'Access denied to the specified chat.'
                    , code: 'CHAT_ACCESS_DENIED'
                    , statusCode: 403
                } );

                // check status code
                expect( result.status ).toBe( 403 );

            }
        );

        it(
            'returns 404 CHAT_NOT_FOUND when chat does not exist'
            , async () => {

                // create test specific data
                const chatId = uuidv4();
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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                // mock getChatOwnership to return null (chat not found)
                postGraphileRequest.mockResponseOnce( { chatById: null } );

                // send request
                const result = await request
                    .delete( `/api/chats/${ chatId }` );

                // get spy results - NONE

                // check times called - NONE

                // check called with - NONE

                // check spy results - NONE

                // check result
                expect( result.body ).toMatchObject( {
                    clientMessage: 'Chat with the given id not found.'
                    , code: 'CHAT_NOT_FOUND'
                    , statusCode: 404
                } );

                // check status code
                expect( result.status ).toBe( 404 );

            }
        );

        it(
            'returns 404 CHAT_NOT_FOUND when chat is already deleted'
            , async () => {

                // create test specific data
                const chatId = uuidv4();
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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                // mock getChatOwnership to return a deleted chat
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , userId: sessionUserId
                        , deletedAt: new Date().toISOString()
                    }
                } );

                // send request
                const result = await request
                    .delete( `/api/chats/${ chatId }` );

                // get spy results - NONE

                // check times called - NONE

                // check called with - NONE

                // check spy results - NONE

                // check result
                expect( result.body ).toMatchObject( {
                    clientMessage: 'Chat with the given id not found.'
                    , code: 'CHAT_NOT_FOUND'
                    , statusCode: 404
                } );

                // check status code
                expect( result.status ).toBe( 404 );

            }
        );

    } );

    describe( 'the request to endpoint is invalid', () => {

        it(
            'returns 400 when chatId is not a valid UUID'
            , async () => {

                // create test specific data
                const invalidChatId = 'not-a-uuid';
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
                    .delete( `/api/chats/${ invalidChatId }` );

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
            'returns 404 ROUTE_NOT_FOUND when chatId is empty (route does not match)'
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

                // send request with empty chatId (spaces) - route doesn't match
                const result = await request
                    .delete( '/api/chats/ ' );

                // get spy results - NONE

                // check times called - NONE

                // check called with - NONE

                // check spy results - NONE

                // check result - route not found because empty space doesn't match :chatId
                expect( result.body ).toMatchObject( {
                    code: 'ROUTE_NOT_FOUND'
                    , statusCode: 404
                } );

                // check status code
                expect( result.status ).toBe( 404 );

            }
        );

    } );

    describe( 'the request to endpoint is valid', () => {

        it(
            'returns 200 with success true when chat is deleted successfully'
            , async () => {

                // create test specific data
                const chatId = uuidv4();
                const sessionUserId = 'mock-user-id';

                // create spys
                const deleteChatSpy = jest.spyOn( ChatsService, 'deleteChat' );

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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                // mock getChatOwnership to return owned chat
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , userId: sessionUserId
                        , deletedAt: null
                    }
                } );

                // mock deleteChat mutation
                postGraphileRequest.mockResponseOnce( {
                    updateChatById: {
                        chat: {
                            id: chatId
                            , deletedAt: new Date().toISOString()
                        }
                    }
                } );

                // send request
                const result = await request
                    .delete( `/api/chats/${ chatId }` );

                // get spy results
                const spyResult = await deleteChatSpy.mock.results[ 0 ].value;

                // check times called
                expect( deleteChatSpy ).toHaveBeenCalledTimes( 1 );

                // check called with
                expect( deleteChatSpy ).toHaveBeenCalledWith( chatId );

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
            'returns 404 CHAT_NOT_FOUND when updateChatById returns null'
            , async () => {

                // create test specific data
                const chatId = uuidv4();
                const sessionUserId = 'mock-user-id';

                // create spys
                const deleteChatSpy = jest.spyOn( ChatsService, 'deleteChat' );

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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                // mock getChatOwnership to return owned chat
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , userId: sessionUserId
                        , deletedAt: null
                    }
                } );

                // mock deleteChat mutation to return null chat
                postGraphileRequest.mockResponseOnce( { updateChatById: { chat: null } } );

                // send request
                const result = await request
                    .delete( `/api/chats/${ chatId }` );

                // get spy results
                const spyResult = await deleteChatSpy.mock.results[ 0 ].value;

                // check times called
                expect( deleteChatSpy ).toHaveBeenCalledTimes( 1 );

                // check spy results
                expect( spyResult.isError() ).toBe( true );

                // check result
                expect( result.body ).toMatchObject( {
                    clientMessage: 'Chat not found.'
                    , code: 'CHAT_NOT_FOUND'
                    , statusCode: 404
                } );

                // check status code
                expect( result.status ).toBe( 404 );

            }
        );

        it(
            'returns 404 CHAT_NOT_FOUND when updateChatById is null'
            , async () => {

                // create test specific data
                const chatId = uuidv4();
                const sessionUserId = 'mock-user-id';

                // create spys
                const deleteChatSpy = jest.spyOn( ChatsService, 'deleteChat' );

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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                // mock getChatOwnership to return owned chat
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , userId: sessionUserId
                        , deletedAt: null
                    }
                } );

                // mock deleteChat mutation to return null updateChatById
                postGraphileRequest.mockResponseOnce( { updateChatById: null } );

                // send request
                const result = await request
                    .delete( `/api/chats/${ chatId }` );

                // get spy results
                const spyResult = await deleteChatSpy.mock.results[ 0 ].value;

                // check times called
                expect( deleteChatSpy ).toHaveBeenCalledTimes( 1 );

                // check spy results
                expect( spyResult.isError() ).toBe( true );

                // check result
                expect( result.body ).toMatchObject( {
                    clientMessage: 'Chat not found.'
                    , code: 'CHAT_NOT_FOUND'
                    , statusCode: 404
                } );

                // check status code
                expect( result.status ).toBe( 404 );

            }
        );

        it(
            'returns error when postGraphile request fails during delete'
            , async () => {

                // create test specific data
                const chatId = uuidv4();
                const sessionUserId = 'mock-user-id';

                // create spys
                const deleteChatSpy = jest.spyOn( ChatsService, 'deleteChat' );

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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                // mock getChatOwnership to return owned chat
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , userId: sessionUserId
                        , deletedAt: null
                    }
                } );

                // mock deleteChat mutation to fail
                postGraphileRequest.mockResponseErrorOnce(
                    new ResourceError( {
                        message: 'Database connection failed'
                        , code: 'DATABASE_ERROR'
                        , statusCode: 500
                    } )
                );

                // send request
                const result = await request
                    .delete( `/api/chats/${ chatId }` );

                // get spy results
                const spyResult = await deleteChatSpy.mock.results[ 0 ].value;

                // check times called
                expect( deleteChatSpy ).toHaveBeenCalledTimes( 1 );

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

        it(
            'returns error when postGraphile request fails during ownership check'
            , async () => {

                // create test specific data
                const chatId = uuidv4();
                const sessionUserId = 'mock-user-id';

                // create spys
                const getChatOwnershipSpy = jest.spyOn( ChatsService, 'getChatOwnership' );

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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                // mock getChatOwnership to fail
                postGraphileRequest.mockResponseErrorOnce(
                    new ResourceError( {
                        message: 'Database connection failed'
                        , code: 'DATABASE_ERROR'
                        , statusCode: 500
                    } )
                );

                // send request
                const result = await request
                    .delete( `/api/chats/${ chatId }` );

                // get spy results
                const spyResult = await getChatOwnershipSpy.mock.results[ 0 ].value;

                // check times called
                expect( getChatOwnershipSpy ).toHaveBeenCalledTimes( 1 );

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
            'handles valid UUID v4 format'
            , async () => {

                // create test specific data
                const chatId = uuidv4();
                const sessionUserId = 'mock-user-id';

                // create spys
                const deleteChatSpy = jest.spyOn( ChatsService, 'deleteChat' );

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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                // mock getChatOwnership to return owned chat
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , userId: sessionUserId
                        , deletedAt: null
                    }
                } );

                // mock deleteChat mutation
                postGraphileRequest.mockResponseOnce( {
                    updateChatById: {
                        chat: {
                            id: chatId
                            , deletedAt: new Date().toISOString()
                        }
                    }
                } );

                // send request
                const result = await request
                    .delete( `/api/chats/${ chatId }` );

                // get spy results
                const spyResult = await deleteChatSpy.mock.results[ 0 ].value;

                // check times called
                expect( deleteChatSpy ).toHaveBeenCalledTimes( 1 );

                // check called with
                expect( deleteChatSpy ).toHaveBeenCalledWith( chatId );

                // check spy results
                expect( spyResult.isSuccess() ).toBe( true );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

        it(
            'handles uppercase UUID format'
            , async () => {

                // create test specific data
                const chatId = uuidv4().toUpperCase();
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
                        , expiresAt: new Date( Date.now() + 24 * 60 * 60 * 1000 )
                        , createdAt: new Date()
                        , updatedAt: new Date()
                    }
                } );

                // mock getChatOwnership to return owned chat
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , userId: sessionUserId
                        , deletedAt: null
                    }
                } );

                // mock deleteChat mutation
                postGraphileRequest.mockResponseOnce( {
                    updateChatById: {
                        chat: {
                            id: chatId
                            , deletedAt: new Date().toISOString()
                        }
                    }
                } );

                // send request
                const result = await request
                    .delete( `/api/chats/${ chatId }` );

                // get spy results - NONE

                // check times called - NONE

                // check called with - NONE

                // check spy results - NONE

                // check result
                expect( result.body ).toStrictEqual( { success: true } );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

    } );

} );

/**
 * Service unit tests for getChatOwnership
 */
describe( 'getChatOwnership service', () => {

    beforeEach( async () => {
        jest.clearAllMocks();
    } );

    it(
        'returns success with chat ownership data'
        , async () => {

            // create test specific data
            const chatId = uuidv4();
            const userId = 'mock-user-id';

            // create spys
            const getChatOwnershipSpy = jest.spyOn( ChatsService, 'getChatOwnership' );

            // create mocks
            postGraphileRequest.mockResponseOnce( {
                chatById: {
                    id: chatId
                    , userId
                    , deletedAt: null
                }
            } );

            // call service directly
            const result = await ChatsService.getChatOwnership( chatId );

            // check times called
            expect( getChatOwnershipSpy ).toHaveBeenCalledTimes( 1 );

            // check called with
            expect( getChatOwnershipSpy ).toHaveBeenCalledWith( chatId );

            // check result
            expect( result.isSuccess() ).toBe( true );
            expect( result.value ).toStrictEqual( {
                id: chatId
                , userId
            } );

        }
    );

    it(
        'returns CHAT_NOT_FOUND error when chatById is null'
        , async () => {

            // create test specific data
            const chatId = uuidv4();

            // create spys
            const getChatOwnershipSpy = jest.spyOn( ChatsService, 'getChatOwnership' );

            // create mocks
            postGraphileRequest.mockResponseOnce( { chatById: null } );

            // call service directly
            const result = await ChatsService.getChatOwnership( chatId );

            // check times called
            expect( getChatOwnershipSpy ).toHaveBeenCalledTimes( 1 );

            // check result
            expect( result.isError() ).toBe( true );
            expect( result.value ).toMatchObject( {
                code: 'CHAT_NOT_FOUND'
                , statusCode: 404
            } );

        }
    );

    it(
        'returns CHAT_NOT_FOUND error when chat is deleted'
        , async () => {

            // create test specific data
            const chatId = uuidv4();
            const userId = 'mock-user-id';

            // create spys
            const getChatOwnershipSpy = jest.spyOn( ChatsService, 'getChatOwnership' );

            // create mocks
            postGraphileRequest.mockResponseOnce( {
                chatById: {
                    id: chatId
                    , userId
                    , deletedAt: new Date().toISOString()
                }
            } );

            // call service directly
            const result = await ChatsService.getChatOwnership( chatId );

            // check times called
            expect( getChatOwnershipSpy ).toHaveBeenCalledTimes( 1 );

            // check result
            expect( result.isError() ).toBe( true );
            expect( result.value ).toMatchObject( {
                code: 'CHAT_NOT_FOUND'
                , statusCode: 404
            } );

        }
    );

    it(
        'returns postGraphile error when request fails'
        , async () => {

            // create test specific data
            const chatId = uuidv4();

            // create spys
            const getChatOwnershipSpy = jest.spyOn( ChatsService, 'getChatOwnership' );

            // create mocks
            postGraphileRequest.mockResponseErrorOnce(
                new ResourceError( {
                    message: 'Database error'
                    , code: 'DATABASE_ERROR'
                    , statusCode: 500
                } )
            );

            // call service directly
            const result = await ChatsService.getChatOwnership( chatId );

            // check times called
            expect( getChatOwnershipSpy ).toHaveBeenCalledTimes( 1 );

            // check result
            expect( result.isError() ).toBe( true );
            expect( result.value ).toMatchObject( {
                code: 'DATABASE_ERROR'
                , statusCode: 500
            } );

        }
    );

} );

/**
 * Error classes unit tests
 */
describe( 'chats error classes', () => {

    it(
        'userChatsNotFound has correct properties'
        , () => {

            // create error instance
            const error = new UserChatsNotFound();

            // check properties
            expect( error.clientMessage ).toBe( 'No chats found for user.' );
            expect( error.code ).toBe( 'USER_CHATS_NOT_FOUND' );
            expect( error.statusCode ).toBe( 404 );

        }
    );

    it(
        'getUserChatsFailed has correct properties'
        , () => {

            // create error instance
            const error = new GetUserChatsFailed();

            // check properties
            expect( error.clientMessage ).toBe( 'Failed to retrieve user chats.' );
            expect( error.code ).toBe( 'GET_USER_CHATS_FAILED' );
            expect( error.statusCode ).toBe( 500 );

        }
    );

    it(
        'chatNotFound has correct properties'
        , () => {

            // create error instance
            const error = new ChatNotFound();

            // check properties
            expect( error.clientMessage ).toBe( 'Chat not found.' );
            expect( error.code ).toBe( 'CHAT_NOT_FOUND' );
            expect( error.statusCode ).toBe( 404 );

        }
    );

    it(
        'deleteChatFailed has correct properties'
        , () => {

            // create error instance
            const error = new DeleteChatFailed();

            // check properties
            expect( error.clientMessage ).toBe( 'Failed to delete chat.' );
            expect( error.code ).toBe( 'DELETE_CHAT_FAILED' );
            expect( error.statusCode ).toBe( 500 );

        }
    );

} );
