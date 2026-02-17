/* ----------------- Mocks ----------------------- */

// Import mocks to trigger jest.doMock() - prevents ESM issues
import '../../lib/postGraphile/__mocks__/postGraphile.request';
import '../../lib/betterAuth/__mocks__/auth';
import '../../lib/mcpToolsServer/__mocks__/mcpToolsServer.request';

import { postGraphileRequest } from '../../lib/postGraphile/__mocks__/postGraphile.request';
import {
    listMcpTools
    , searchMcpTools
} from '../../lib/mcpToolsServer/__mocks__/mcpToolsServer.request';
import {
    mockSessionOnce
    , mockNoSessionOnce
} from '../../lib/betterAuth/__mocks__/auth';

/* ----------------- Mocks ----------------------- */

import supertest from 'supertest';
import { testApp } from '../tests.server';
import { v4 as uuidv4 } from 'uuid';

import {
    ToolsFetchFailed
    , ToolNotFound
} from '../../app/tools/tools.errors';
import { ResourceError } from '../../errors';

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
 * GET /api/tools
 */
describe( 'GET /api/tools', () => {

    beforeEach( async () => {
        jest.clearAllMocks();
    } );

    describe( 'returns authentication errors', () => {

        it(
            'returns 401 UNAUTHORIZED when no session is provided'
            , async () => {

                // create mocks
                mockNoSessionOnce();

                // send request
                const result = await request
                    .get( '/api/tools' );

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
            'returns 200 with tools array'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const toolId1 = uuidv4();

                // create mocks
                mockValidSession( sessionUserId );

                // mock getTools from database
                postGraphileRequest.mockResponseOnce( {
                    allTools: {
                        nodes: [
                            {
                                id: toolId1
                                , name: 'web_search'
                                , description: 'Search the web'
                                , schema: { type: 'object' }
                                , source: 'mcp'
                                , externalId: 'web_search'
                                , version: '1.0.0'
                            }
                        ]
                    }
                } );

                // send request
                const result = await request
                    .get( '/api/tools' );

                // check result
                expect( result.body ).toStrictEqual( {
                    tools: [
                        {
                            id: toolId1
                            , name: 'web_search'
                            , description: 'Search the web'
                            , version: '1.0.0'
                            , source: 'mcp'
                        }
                    ]
                } );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

        it(
            'returns 200 with tools array when refresh=true'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const toolId1 = uuidv4();

                // create mocks
                mockValidSession( sessionUserId );

                // mock MCP tools server for refresh
                listMcpTools.mockResponseOnce( {
                    tools: [
                        {
                            id: 'web_search'
                            , name: 'web_search'
                            , description: 'Search the web'
                            , schema: { type: 'object' }
                            , version: '1.0.0'
                            , tags: []
                        }
                    ]
                    , nextCursor: null
                } );

                // mock getToolByExternalId
                postGraphileRequest.mockResponseOnce( { allTools: { nodes: [] } } );

                // mock createTool
                postGraphileRequest.mockResponseOnce( {
                    createTool: {
                        tool: {
                            id: toolId1
                            , name: 'web_search'
                            , description: 'Search the web'
                            , schema: { type: 'object' }
                            , source: 'mcp'
                            , externalId: 'web_search'
                            , version: '1.0.0'
                        }
                    }
                } );

                // send request
                const result = await request
                    .get( '/api/tools' )
                    .query( { refresh: 'true' } );

                // check status code
                expect( result.status ).toBe( 200 );
                expect( result.body.tools ).toBeDefined();

            }
        );

    } );

    describe( 'service layer errors', () => {

        it(
            'returns error when getCachedTools fails'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';

                // create mocks
                mockValidSession( sessionUserId );

                postGraphileRequest.mockResponseErrorOnce(
                    new ResourceError( {
                        message: 'Database error'
                        , code: 'DATABASE_ERROR'
                        , statusCode: 500
                    } )
                );

                // send request
                const result = await request
                    .get( '/api/tools' );

                // check status code
                expect( result.status ).toBe( 500 );

            }
        );

    } );

} );

/**
 * GET /api/tools/search
 */
describe( 'GET /api/tools/search', () => {

    beforeEach( async () => {
        jest.clearAllMocks();
    } );

    describe( 'returns authentication errors', () => {

        it(
            'returns 401 UNAUTHORIZED when no session is provided'
            , async () => {

                // create mocks
                mockNoSessionOnce();

                // send request
                const result = await request
                    .get( '/api/tools/search' )
                    .query( { q: 'search' } );

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
            'returns 400 when q query parameter is missing'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';

                // create mocks
                mockValidSession( sessionUserId );

                // send request
                const result = await request
                    .get( '/api/tools/search' );

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
            'returns 400 when q query parameter is empty'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';

                // create mocks
                mockValidSession( sessionUserId );

                // send request
                const result = await request
                    .get( '/api/tools/search' )
                    .query( { q: '' } );

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
            'returns 200 with search results'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const toolId1 = uuidv4();

                // create mocks
                mockValidSession( sessionUserId );

                // mock MCP search
                searchMcpTools.mockResponseOnce( {
                    tools: [
                        {
                            id: 'web_search'
                            , name: 'web_search'
                            , description: 'Search the web'
                            , schema: { type: 'object' }
                            , version: '1.0.0'
                            , tags: []
                        }
                    ]
                } );

                // mock getToolByExternalId
                postGraphileRequest.mockResponseOnce( { allTools: { nodes: [] } } );

                // mock createTool
                postGraphileRequest.mockResponseOnce( {
                    createTool: {
                        tool: {
                            id: toolId1
                            , name: 'web_search'
                            , description: 'Search the web'
                            , schema: { type: 'object' }
                            , source: 'mcp'
                            , externalId: 'web_search'
                            , version: '1.0.0'
                        }
                    }
                } );

                // send request
                const result = await request
                    .get( '/api/tools/search' )
                    .query( { q: 'web' } );

                // check status code
                expect( result.status ).toBe( 200 );
                expect( result.body.tools ).toBeDefined();

            }
        );

    } );

} );

/**
 * GET /api/tools/:toolId
 */
describe( 'GET /api/tools/:toolId', () => {

    beforeEach( async () => {
        jest.clearAllMocks();
    } );

    describe( 'returns authentication errors', () => {

        it(
            'returns 401 UNAUTHORIZED when no session is provided'
            , async () => {

                // create test specific data
                const toolId = uuidv4();

                // create mocks
                mockNoSessionOnce();

                // send request
                const result = await request
                    .get( `/api/tools/${ toolId }` );

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
            'returns 404 when toolId does not exist in database'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const nonExistentToolId = 'not-a-uuid';

                // create mocks
                mockValidSession( sessionUserId );

                // mock database lookup - tool not found
                postGraphileRequest.mockResponseOnce( { toolById: null } );

                // send request
                const result = await request
                    .get( `/api/tools/${ nonExistentToolId }` );

                // check result - service returns 404 when tool not found
                expect( result.body ).toMatchObject( {
                    code: 'TOOL_NOT_FOUND'
                    , statusCode: 404
                } );

                // check status code
                expect( result.status ).toBe( 404 );

            }
        );

    } );

    describe( 'the request to endpoint is valid', () => {

        it(
            'returns 200 with tool details'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const toolId = uuidv4();

                // create mocks
                mockValidSession( sessionUserId );

                postGraphileRequest.mockResponseOnce( {
                    toolById: {
                        id: toolId
                        , name: 'web_search'
                        , description: 'Search the web'
                        , schema: { type: 'object' }
                        , source: 'mcp'
                        , externalId: 'web_search'
                        , version: '1.0.0'
                    }
                } );

                // send request
                const result = await request
                    .get( `/api/tools/${ toolId }` );

                // check result
                expect( result.body ).toStrictEqual( {
                    tool: {
                        id: toolId
                        , name: 'web_search'
                        , description: 'Search the web'
                        , version: '1.0.0'
                        , source: 'mcp'
                        , schema: { type: 'object' }
                    }
                } );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

    } );

    describe( 'service layer errors', () => {

        it(
            'returns 404 TOOL_NOT_FOUND when tool does not exist'
            , async () => {

                // create test specific data
                const sessionUserId = 'mock-user-id';
                const toolId = uuidv4();

                // create mocks
                mockValidSession( sessionUserId );

                postGraphileRequest.mockResponseOnce( { toolById: null } );

                // send request
                const result = await request
                    .get( `/api/tools/${ toolId }` );

                // check result
                expect( result.body ).toMatchObject( {
                    clientMessage: 'Tool not found.'
                    , code: 'TOOL_NOT_FOUND'
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
describe( 'tools error classes', () => {

    it(
        'toolsFetchFailed has correct properties'
        , () => {

            // create error instance
            const err = new ToolsFetchFailed();

            // check properties
            expect( err.clientMessage ).toBe( 'Failed to fetch tools.' );
            expect( err.code ).toBe( 'TOOLS_FETCH_FAILED' );
            expect( err.statusCode ).toBe( 500 );

        }
    );

    it(
        'toolNotFound has correct properties'
        , () => {

            // create error instance
            const err = new ToolNotFound();

            // check properties
            expect( err.clientMessage ).toBe( 'Tool not found.' );
            expect( err.code ).toBe( 'TOOL_NOT_FOUND' );
            expect( err.statusCode ).toBe( 404 );

        }
    );

} );
