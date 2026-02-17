/* ----------------- Mocks ----------------------- */

import { postGraphileRequest } from '../../lib/postGraphile/__mocks__/postGraphile.request';
import {
    mockSessionOnce
    , mockNoSessionOnce
} from '../../lib/betterAuth/__mocks__/auth';

/* ----------------- Mocks ----------------------- */

// Mock LLM module - must return Promise-based mocks
jest.mock( '../../lib/llm', () => ( {
    streamLLMText: jest.fn().mockResolvedValue( { textStream: [], sources: [] } )
    , generateLLMText: jest.fn().mockResolvedValue( { content: '', sources: [] } )
} ) );

/*
 * Mock messages helper module - must return Promises since code calls .catch()
 * on results
 */
jest.mock( '../../app/messages/messages.helper', () => ( {
    generateLLMResponse: jest.fn().mockResolvedValue( { content: '', sources: [] } )
    , generateAndUpdateChatTitle: jest.fn().mockResolvedValue( undefined )
    , generateFallbackChatTitle: jest.fn().mockResolvedValue( undefined )
    , processChatHistory: jest.fn().mockImplementation( async ( { messages } ) => messages )
} ) );

// Mock workflow runner module
jest.mock( '../../lib/workflowRunner', () => ( { runWorkflow: jest.fn().mockResolvedValue( { isError: () => false, value: { content: '', workflowRunId: '' } } ) } ) );

import supertest from 'supertest';
import { testApp } from '../tests.server';
import { v4 as uuidv4 } from 'uuid';

import * as MessagesService from '../../app/messages/messages.service';
import * as MessagesHelper from '../../app/messages/messages.helper';
import * as WorkflowRunsService from '../../app/workflowRuns/workflowRuns.service';
import { success } from '../../types';
import {
    ChatNotFound
    , MessagesNotFound
    , CreateMessageFailed
    , CreateChatFailed
    , ChatAccessForbidden
    , WorkflowRunInProgress
} from '../../app/messages/messages.errors';

// set up server for testing - supertest handles server lifecycle internally
const request = supertest( testApp );

/**
 * Helper to create a valid session mock
 */
const mockValidSession = ( userId: string ): void => {
    mockSessionOnce( {
        user: {
            id: userId
            , email: 'test@example.com'
            , name: 'Test User'
            , emailVerified: true
            , createdAt: new Date()
            , updatedAt: new Date()
        }
        , session: {
            id: 'mock-session-id'
            , userId
            , expiresAt: new Date( Date.now() + ( 24 * 60 * 60 * 1000 ) )
            , createdAt: new Date()
            , updatedAt: new Date()
        }
    } );
};

/**
 * POST /api/chats/:chatId/messages
 */
describe( 'POST /api/chats/:chatId/messages', () => {

    beforeEach( async () => {
        jest.clearAllMocks();
    } );

    describe( 'returns authentication errors', () => {

        it(
            'returns 401 UNAUTHORIZED when no session is provided'
            , async () => {

                // create test specific data
                const chatId = uuidv4();

                // create mocks
                mockNoSessionOnce();

                // send request
                const result = await request
                    .post( `/api/chats/${ chatId }/messages` )
                    .send( {
                        content: 'Hello'
                        , modelId: 'gpt-4o'
                        , userId: 'test-user'
                    } );

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
            'returns 403 CHAT_ACCESS_DENIED when chat belongs to different user'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const otherUserId = 'other-user-id';
                const chatId = uuidv4();

                // create mocks
                mockValidSession( sessionUserId );

                // mock getChatOwnership - chat exists but belongs to other user
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , userId: otherUserId
                    }
                } );

                // send request
                const result = await request
                    .post( `/api/chats/${ chatId }/messages` )
                    .send( {
                        content: 'Hello'
                        , modelId: 'gpt-4o'
                        , userId: sessionUserId
                    } );

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

    describe( 'the request to endpoint is valid - new chat', () => {

        it(
            'returns 201 with user and assistant messages for new chat'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const chatId = uuidv4();
                const userMessageId = uuidv4();
                const assistantMessageId = uuidv4();

                // create spys
                const getChatByIdSpy = jest.spyOn( MessagesService, 'getChatById' );
                const createChatSpy = jest.spyOn( MessagesService, 'createChat' );
                const createMessageSpy = jest.spyOn( MessagesService, 'createMessage' );

                // create mocks
                mockValidSession( sessionUserId );

                /*
                 * mock getChatOwnership - chat not found (allows POST to create
                 * new chat)
                 */
                postGraphileRequest.mockResponseOnce( { chatById: null } );

                // mock getChatById in controller - chat not found
                postGraphileRequest.mockResponseOnce( { chatById: null } );

                // mock createChat
                postGraphileRequest.mockResponseOnce( { createChat: { chat: { id: chatId } } } );

                // mock getRunningWorkflowRunByChatId - no running workflow
                postGraphileRequest.mockResponseOnce( { allWorkflowRuns: { nodes: [] } } );

                // mock createMessage for user message
                postGraphileRequest.mockResponseOnce( {
                    createMessage: {
                        message: {
                            id: userMessageId
                            , createdAt: '2024-01-01T00:00:00Z'
                        }
                    }
                } );

                // mock getMessagesByChatId for conversation history
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , messagesByChatId: {
                            nodes: [
                                {
                                    id: userMessageId
                                    , role: 'USER'
                                    , content: 'Hello'
                                    , createdAt: '2024-01-01T00:00:00Z'
                                    , messageSourcesByMessageId: { nodes: [] }
                                }
                            ]
                        }
                    }
                } );

                // mock generateLLMResponse
                ( MessagesHelper.generateLLMResponse as jest.Mock ).mockResolvedValueOnce(
                    success( {
                        content: 'Hello! How can I help you?'
                        , sources: []
                    } )
                );

                // mock createMessage for assistant message
                postGraphileRequest.mockResponseOnce( {
                    createMessage: {
                        message: {
                            id: assistantMessageId
                            , createdAt: '2024-01-01T00:00:01Z'
                        }
                    }
                } );

                // mock generateAndUpdateChatTitle
                ( MessagesHelper.generateAndUpdateChatTitle as jest.Mock ).mockResolvedValueOnce( undefined );

                // send request
                const result = await request
                    .post( `/api/chats/${ chatId }/messages` )
                    .send( {
                        content: 'Hello'
                        , modelId: 'gpt-4o'
                        , userId: sessionUserId
                    } );

                // check times called
                expect( getChatByIdSpy ).toHaveBeenCalledTimes( 1 );
                expect( createChatSpy ).toHaveBeenCalledTimes( 1 );
                expect( createMessageSpy ).toHaveBeenCalledTimes( 2 );

                // check result
                expect( result.body.userMessage ).toMatchObject( {
                    id: userMessageId
                    , role: 'user'
                    , content: 'Hello'
                } );
                expect( result.body.assistantMessage ).toMatchObject( {
                    id: assistantMessageId
                    , role: 'assistant'
                    , content: 'Hello! How can I help you?'
                } );
                expect( result.body.chatId ).toBe( chatId );

                // check status code
                expect( result.status ).toBe( 201 );

            }
        );

    } );

    describe( 'the request to endpoint is valid - existing chat', () => {

        it(
            'returns 201 with user and assistant messages for existing chat'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const chatId = uuidv4();
                const userMessageId = uuidv4();
                const assistantMessageId = uuidv4();

                // create spys
                const getChatByIdSpy = jest.spyOn( MessagesService, 'getChatById' );
                const createMessageSpy = jest.spyOn( MessagesService, 'createMessage' );

                // create mocks
                mockValidSession( sessionUserId );

                // mock getChatOwnership - chat exists and belongs to user
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , userId: sessionUserId
                    }
                } );

                // mock getChatById - existing chat
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , userId: sessionUserId
                        , title: 'Existing Chat'
                        , createdAt: '2024-01-01T00:00:00Z'
                        , updatedAt: '2024-01-01T00:00:00Z'
                    }
                } );

                // mock getRunningWorkflowRunByChatId - no running workflow
                postGraphileRequest.mockResponseOnce( { allWorkflowRuns: { nodes: [] } } );

                // mock createMessage for user message
                postGraphileRequest.mockResponseOnce( {
                    createMessage: {
                        message: {
                            id: userMessageId
                            , createdAt: '2024-01-01T00:00:00Z'
                        }
                    }
                } );

                // mock getMessagesByChatId for conversation history
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , messagesByChatId: {
                            nodes: [
                                {
                                    id: userMessageId
                                    , role: 'USER'
                                    , content: 'Can you help me?'
                                    , createdAt: '2024-01-01T00:00:00Z'
                                    , messageSourcesByMessageId: { nodes: [] }
                                }
                            ]
                        }
                    }
                } );

                // mock generateLLMResponse
                ( MessagesHelper.generateLLMResponse as jest.Mock ).mockResolvedValueOnce(
                    success( {
                        content: 'I can help with that!'
                        , sources: [
                            {
                                url: 'https://example.com'
                                , title: 'Example'
                                , description: 'An example source'
                            }
                        ]
                    } )
                );

                // mock createMessage for assistant message
                postGraphileRequest.mockResponseOnce( {
                    createMessage: {
                        message: {
                            id: assistantMessageId
                            , createdAt: '2024-01-01T00:00:01Z'
                        }
                    }
                } );

                // mock createMessageSource
                postGraphileRequest.mockResponseOnce( { createMessageSource: { messageSource: { id: uuidv4() } } } );

                // send request
                const result = await request
                    .post( `/api/chats/${ chatId }/messages` )
                    .send( {
                        content: 'Can you help me?'
                        , modelId: 'gpt-4o'
                        , userId: sessionUserId
                    } );

                // check times called
                expect( getChatByIdSpy ).toHaveBeenCalledTimes( 1 );
                expect( createMessageSpy ).toHaveBeenCalledTimes( 2 );

                // check result
                expect( result.body.userMessage ).toMatchObject( {
                    id: userMessageId
                    , role: 'user'
                } );
                expect( result.body.assistantMessage ).toMatchObject( {
                    id: assistantMessageId
                    , role: 'assistant'
                    , sources: [
                        {
                            url: 'https://example.com'
                            , title: 'Example'
                            , description: 'An example source'
                        }
                    ]
                } );

                // check status code
                expect( result.status ).toBe( 201 );

            }
        );

    } );

    describe( 'workflow-related tests', () => {

        it(
            'returns 409 WORKFLOW_RUN_IN_PROGRESS when a workflow is already running'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const chatId = uuidv4();
                const runningWorkflowRunId = uuidv4();

                // create spys
                const getRunningWorkflowRunByChatIdSpy = jest.spyOn( WorkflowRunsService, 'getRunningWorkflowRunByChatId' );

                // create mocks
                mockValidSession( sessionUserId );

                // mock getChatOwnership - chat exists and belongs to user
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , userId: sessionUserId
                    }
                } );

                // mock getChatById - existing chat
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , userId: sessionUserId
                        , title: 'Chat'
                        , createdAt: '2024-01-01T00:00:00Z'
                        , updatedAt: '2024-01-01T00:00:00Z'
                    }
                } );

                // mock getRunningWorkflowRunByChatId - workflow is running
                postGraphileRequest.mockResponseOnce(
                    { allWorkflowRuns: { nodes: [ { id: runningWorkflowRunId } ] } }
                );

                // send request
                const result = await request
                    .post( `/api/chats/${ chatId }/messages` )
                    .send( {
                        content: 'Hello'
                        , modelId: 'gpt-4o'
                        , userId: sessionUserId
                    } );

                // check times called
                expect( getRunningWorkflowRunByChatIdSpy ).toHaveBeenCalledTimes( 1 );

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'WORKFLOW_RUN_IN_PROGRESS'
                    , statusCode: 409
                } );

                // check status code
                expect( result.status ).toBe( 409 );

            }
        );

    } );

    describe( 'service layer errors', () => {

        it(
            'returns error when createChat fails'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const chatId = uuidv4();

                // create spys
                const createChatSpy = jest.spyOn( MessagesService, 'createChat' );

                // create mocks
                mockValidSession( sessionUserId );

                /*
                 * mock getChatOwnership - chat not found (allows POST to create
                 * new chat)
                 */
                postGraphileRequest.mockResponseOnce( { chatById: null } );

                // mock getChatById - chat not found
                postGraphileRequest.mockResponseOnce( { chatById: null } );

                // mock createChat - failure
                postGraphileRequest.mockResponseOnce( { createChat: null } );

                // send request
                const result = await request
                    .post( `/api/chats/${ chatId }/messages` )
                    .send( {
                        content: 'Hello'
                        , modelId: 'gpt-4o'
                        , userId: sessionUserId
                    } );

                // check times called
                expect( createChatSpy ).toHaveBeenCalledTimes( 1 );

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'CREATE_CHAT_FAILED'
                    , statusCode: 500
                } );

                // check status code
                expect( result.status ).toBe( 500 );

            }
        );

        it(
            'returns error when createMessage fails for user message'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const chatId = uuidv4();

                // create spys
                const createMessageSpy = jest.spyOn( MessagesService, 'createMessage' );

                // create mocks
                mockValidSession( sessionUserId );

                // mock getChatOwnership - chat exists and belongs to user
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , userId: sessionUserId
                    }
                } );

                // mock getChatById - existing chat
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , userId: sessionUserId
                        , title: 'Chat'
                        , createdAt: '2024-01-01T00:00:00Z'
                        , updatedAt: '2024-01-01T00:00:00Z'
                    }
                } );

                // mock getRunningWorkflowRunByChatId - no running workflow
                postGraphileRequest.mockResponseOnce( { allWorkflowRuns: { nodes: [] } } );

                // mock createMessage - failure
                postGraphileRequest.mockResponseOnce( { createMessage: null } );

                // send request
                const result = await request
                    .post( `/api/chats/${ chatId }/messages` )
                    .send( {
                        content: 'Hello'
                        , modelId: 'gpt-4o'
                        , userId: sessionUserId
                    } );

                // check times called
                expect( createMessageSpy ).toHaveBeenCalledTimes( 1 );

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'CREATE_MESSAGE_FAILED'
                    , statusCode: 500
                } );

                // check status code
                expect( result.status ).toBe( 500 );

            }
        );

    } );

} );

/**
 * GET /api/chats/:chatId/messages
 */
describe( 'GET /api/chats/:chatId/messages', () => {

    beforeEach( async () => {
        jest.clearAllMocks();
    } );

    describe( 'returns authentication errors', () => {

        it(
            'returns 401 UNAUTHORIZED when no session is provided'
            , async () => {

                // create test specific data
                const chatId = uuidv4();

                // create mocks
                mockNoSessionOnce();

                // send request
                const result = await request
                    .get( `/api/chats/${ chatId }/messages` );

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

                // create mocks
                mockValidSession( sessionUserId );

                // mock chat ownership query - chat belongs to other user
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , userId: otherUserId
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/chats/${ chatId }/messages` );

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'CHAT_ACCESS_DENIED'
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
                const sessionUserId = 'mock-user-id';
                const chatId = uuidv4();

                // create mocks
                mockValidSession( sessionUserId );

                // mock chat ownership check - chat not found
                postGraphileRequest.mockResponseOnce( { chatById: null } );

                // send request
                const result = await request
                    .get( `/api/chats/${ chatId }/messages` );

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'CHAT_NOT_FOUND'
                    , statusCode: 404
                } );

                // check status code
                expect( result.status ).toBe( 404 );

            }
        );

    } );

    describe( 'the request to endpoint is valid', () => {

        it(
            'returns 200 with messages array'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const chatId = uuidv4();
                const messageId = uuidv4();

                // create spys
                const getMessagesByChatIdSpy = jest.spyOn( MessagesService, 'getMessagesByChatId' );

                // create mocks
                mockValidSession( sessionUserId );

                // mock chat ownership check
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , userId: sessionUserId
                    }
                } );

                // mock getMessagesByChatId
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , messagesByChatId: {
                            nodes: [
                                {
                                    id: messageId
                                    , role: 'USER'
                                    , content: 'Hello'
                                    , createdAt: '2024-01-01T00:00:00Z'
                                    , messageSourcesByMessageId: { nodes: [] }
                                }
                            ]
                        }
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/chats/${ chatId }/messages` );

                // check times called
                expect( getMessagesByChatIdSpy ).toHaveBeenCalledTimes( 1 );

                // check called with
                expect( getMessagesByChatIdSpy ).toHaveBeenCalledWith( chatId );

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
            'returns 200 with messages including sources'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const chatId = uuidv4();
                const messageId = uuidv4();
                const sourceId = uuidv4();

                // create spys
                const getMessagesByChatIdSpy = jest.spyOn( MessagesService, 'getMessagesByChatId' );

                // create mocks
                mockValidSession( sessionUserId );

                // mock chat ownership check
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , userId: sessionUserId
                    }
                } );

                // mock getMessagesByChatId with sources
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , messagesByChatId: {
                            nodes: [
                                {
                                    id: messageId
                                    , role: 'ASSISTANT'
                                    , content: 'Here is what I found'
                                    , createdAt: '2024-01-01T00:00:00Z'
                                    , messageSourcesByMessageId: {
                                        nodes: [
                                            {
                                                id: sourceId
                                                , url: 'https://example.com'
                                                , title: 'Example'
                                                , description: 'Description'
                                                , position: 0
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
                    .get( `/api/chats/${ chatId }/messages` );

                // check times called
                expect( getMessagesByChatIdSpy ).toHaveBeenCalledTimes( 1 );

                // check result
                expect( result.body.messages[ 0 ].sources ).toHaveLength( 1 );
                expect( result.body.messages[ 0 ].sources[ 0 ] ).toMatchObject( {
                    url: 'https://example.com'
                    , title: 'Example'
                    , description: 'Description'
                } );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

    } );

    describe( 'service layer errors', () => {

        it(
            'returns 404 when chat has no messages'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const chatId = uuidv4();

                // create mocks
                mockValidSession( sessionUserId );

                // mock chat ownership check
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , userId: sessionUserId
                    }
                } );

                // mock getMessagesByChatId - no messages
                postGraphileRequest.mockResponseOnce( {
                    chatById: {
                        id: chatId
                        , messagesByChatId: { nodes: [] }
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/chats/${ chatId }/messages` );

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'MESSAGES_NOT_FOUND'
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
describe( 'messages error classes', () => {

    it(
        'chatNotFound has correct properties'
        , () => {

            // create error instance
            const err = new ChatNotFound();

            // check properties
            expect( err.clientMessage ).toBe( 'Chat not found.' );
            expect( err.code ).toBe( 'CHAT_NOT_FOUND' );
            expect( err.statusCode ).toBe( 404 );

        }
    );

    it(
        'messagesNotFound has correct properties'
        , () => {

            // create error instance
            const err = new MessagesNotFound();

            // check properties
            expect( err.clientMessage ).toBe( 'No messages found for this chat.' );
            expect( err.code ).toBe( 'MESSAGES_NOT_FOUND' );
            expect( err.statusCode ).toBe( 404 );

        }
    );

    it(
        'createMessageFailed has correct properties'
        , () => {

            // create error instance
            const err = new CreateMessageFailed();

            // check properties
            expect( err.clientMessage ).toBe( 'Failed to create message.' );
            expect( err.code ).toBe( 'CREATE_MESSAGE_FAILED' );
            expect( err.statusCode ).toBe( 500 );

        }
    );

    it(
        'createChatFailed has correct properties'
        , () => {

            // create error instance
            const err = new CreateChatFailed();

            // check properties
            expect( err.clientMessage ).toBe( 'Failed to create chat.' );
            expect( err.code ).toBe( 'CREATE_CHAT_FAILED' );
            expect( err.statusCode ).toBe( 500 );

        }
    );

    it(
        'chatAccessForbidden has correct properties'
        , () => {

            // create error instance
            const err = new ChatAccessForbidden();

            // check properties
            expect( err.clientMessage ).toBe( 'You do not have permission to access this chat.' );
            expect( err.code ).toBe( 'CHAT_ACCESS_FORBIDDEN' );
            expect( err.statusCode ).toBe( 403 );

        }
    );

    it(
        'workflowRunInProgress has correct properties'
        , () => {

            // create error instance
            const err = new WorkflowRunInProgress();

            // check properties
            expect( err.clientMessage ).toBe( 'A workflow is currently running for this chat. Please wait for it to finish.' );
            expect( err.code ).toBe( 'WORKFLOW_RUN_IN_PROGRESS' );
            expect( err.statusCode ).toBe( 409 );

        }
    );

} );
