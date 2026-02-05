import supertest from 'supertest';
import { testApp } from '../tests.server';
import {
    getServiceAuthHeader
    , buildMcpRequest
} from '../tests.helper';

import {
    MCPToolNotFound
    , MCPMethodNotFound
    , MCPToolExecutionFailed
} from '../../app/v0/tools/tools.errors';

// set up server for testing
const server = testApp.listen();
const request = supertest( server );

afterAll( async () => {
    server.close();
} );

/**
 * POST /mcp - Authentication
 */
describe( 'POST /mcp - Authentication', () => {

    beforeEach( async () => {
        jest.clearAllMocks();
    } );

    describe( 'returns authentication errors', () => {

        it(
            'returns 401 UNAUTHORIZED when no service key is provided'
            , async () => {

                // send request without auth header
                const result = await request
                    .post( '/mcp' )
                    .send( buildMcpRequest( 'listTools' ) );

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
            'returns 401 UNAUTHORIZED when invalid service key is provided'
            , async () => {

                // send request with wrong key
                const result = await request
                    .post( '/mcp' )
                    .set( 'x-service-key', 'wrong-key' )
                    .send( buildMcpRequest( 'listTools' ) );

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

} );

/**
 * POST /mcp - Request Validation
 */
describe( 'POST /mcp - Request Validation', () => {

    beforeEach( async () => {
        jest.clearAllMocks();
    } );

    describe( 'returns validation errors', () => {

        it(
            'returns 400 when method is missing'
            , async () => {

                // send request without method
                const result = await request
                    .post( '/mcp' )
                    .set( ...getServiceAuthHeader() )
                    .send( { params: {} } );

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'BAD_REQUEST'
                    , statusCode: 400
                } );

                // check status code
                expect( result.status ).toBe( 400 );

            }
        );

        it(
            'returns 400 when params is missing'
            , async () => {

                // send request without params
                const result = await request
                    .post( '/mcp' )
                    .set( ...getServiceAuthHeader() )
                    .send( { method: 'listTools' } );

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'BAD_REQUEST'
                    , statusCode: 400
                } );

                // check status code
                expect( result.status ).toBe( 400 );

            }
        );

        it(
            'returns 400 when method is invalid'
            , async () => {

                // send request with invalid method
                const result = await request
                    .post( '/mcp' )
                    .set( ...getServiceAuthHeader() )
                    .send( { method: 'invalidMethod', params: {} } );

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'BAD_REQUEST'
                    , statusCode: 400
                } );

                // check status code
                expect( result.status ).toBe( 400 );

            }
        );

    } );

} );

/**
 * POST /mcp - listTools method
 */
describe( 'POST /mcp - listTools', () => {

    beforeEach( async () => {
        jest.clearAllMocks();
    } );

    describe( 'the request to endpoint is valid', () => {

        it(
            'returns 200 with tools array'
            , async () => {

                // send request
                const result = await request
                    .post( '/mcp' )
                    .set( ...getServiceAuthHeader() )
                    .send( buildMcpRequest( 'listTools' ) );

                // check result structure
                expect( result.body ).toHaveProperty( 'result' );
                expect( result.body.result ).toHaveProperty( 'tools' );
                expect( Array.isArray( result.body.result.tools ) ).toBe( true );
                expect( result.body.result ).toHaveProperty( 'nextCursor' );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

        it(
            'returns 200 with tools array respecting limit param'
            , async () => {

                // send request with limit
                const result = await request
                    .post( '/mcp' )
                    .set( ...getServiceAuthHeader() )
                    .send( buildMcpRequest( 'listTools', { limit: 2 } ) );

                // check result structure
                expect( result.body.result.tools.length ).toBeLessThanOrEqual( 2 );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

        it(
            'returns tools with expected properties'
            , async () => {

                // send request
                const result = await request
                    .post( '/mcp' )
                    .set( ...getServiceAuthHeader() )
                    .send( buildMcpRequest( 'listTools', { limit: 1 } ) );

                // check tool structure
                const tool = result.body.result.tools[ 0 ];
                expect( tool ).toHaveProperty( 'id' );
                expect( tool ).toHaveProperty( 'name' );
                expect( tool ).toHaveProperty( 'description' );
                expect( tool ).toHaveProperty( 'schema' );
                expect( tool ).toHaveProperty( 'version' );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

    } );

} );

/**
 * POST /mcp - searchTools method
 */
describe( 'POST /mcp - searchTools', () => {

    beforeEach( async () => {
        jest.clearAllMocks();
    } );

    describe( 'the request to endpoint is valid', () => {

        it(
            'returns 200 with matching tools'
            , async () => {

                // send request
                const result = await request
                    .post( '/mcp' )
                    .set( ...getServiceAuthHeader() )
                    .send( buildMcpRequest( 'searchTools', { query: 'search' } ) );

                // check result structure
                expect( result.body ).toHaveProperty( 'result' );
                expect( result.body.result ).toHaveProperty( 'tools' );
                expect( Array.isArray( result.body.result.tools ) ).toBe( true );

                // check that results contain search query
                const tools = result.body.result.tools;
                if ( tools.length > 0 ) {
                    const matchesQuery = tools.some( ( t: { name: string; description: string } ) =>
                        t.name.toLowerCase().includes( 'search' )
                        || t.description.toLowerCase().includes( 'search' )
                    );
                    expect( matchesQuery ).toBe( true );
                }

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

        it(
            'returns 200 with empty array for non-matching query'
            , async () => {

                // send request with query that won't match
                const result = await request
                    .post( '/mcp' )
                    .set( ...getServiceAuthHeader() )
                    .send( buildMcpRequest( 'searchTools', { query: 'nonexistenttoolxyz' } ) );

                // check result structure
                expect( result.body.result.tools ).toEqual( [] );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

        it(
            'returns 200 with results respecting limit param'
            , async () => {

                // send request with limit
                const result = await request
                    .post( '/mcp' )
                    .set( ...getServiceAuthHeader() )
                    .send( buildMcpRequest( 'searchTools', { query: 'tool', limit: 1 } ) );

                // check result structure
                expect( result.body.result.tools.length ).toBeLessThanOrEqual( 1 );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

    } );

} );

/**
 * POST /mcp - getTool method
 */
describe( 'POST /mcp - getTool', () => {

    beforeEach( async () => {
        jest.clearAllMocks();
    } );

    describe( 'the request to endpoint is valid', () => {

        it(
            'returns 200 with tool details for existing tool'
            , async () => {

                // send request for known tool
                const result = await request
                    .post( '/mcp' )
                    .set( ...getServiceAuthHeader() )
                    .send( buildMcpRequest( 'getTool', { id: 'tool_web_search' } ) );

                // check result structure
                expect( result.body ).toHaveProperty( 'result' );
                expect( result.body.result ).toHaveProperty( 'tool' );
                expect( result.body.result.tool ).toMatchObject( {
                    id: 'tool_web_search'
                    , name: 'web_search'
                } );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

        it(
            'returns 200 with tool details when version matches'
            , async () => {

                // send request with version
                const result = await request
                    .post( '/mcp' )
                    .set( ...getServiceAuthHeader() )
                    .send( buildMcpRequest( 'getTool', { id: 'tool_web_search', version: '1.0.0' } ) );

                // check result structure
                expect( result.body.result.tool ).toMatchObject( {
                    id: 'tool_web_search'
                    , version: '1.0.0'
                } );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

    } );

    describe( 'returns errors for invalid requests', () => {

        it(
            'returns 404 when tool does not exist'
            , async () => {

                // send request for non-existent tool
                const result = await request
                    .post( '/mcp' )
                    .set( ...getServiceAuthHeader() )
                    .send( buildMcpRequest( 'getTool', { id: 'nonexistent_tool' } ) );

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'MCP_TOOL_NOT_FOUND'
                    , statusCode: 404
                } );

                // check status code
                expect( result.status ).toBe( 404 );

            }
        );

        it(
            'returns 404 when version does not match'
            , async () => {

                // send request with wrong version
                const result = await request
                    .post( '/mcp' )
                    .set( ...getServiceAuthHeader() )
                    .send( buildMcpRequest( 'getTool', { id: 'tool_web_search', version: '99.0.0' } ) );

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'MCP_TOOL_NOT_FOUND'
                    , statusCode: 404
                } );

                // check status code
                expect( result.status ).toBe( 404 );

            }
        );

    } );

} );

/**
 * POST /mcp - runTool method
 */
describe( 'POST /mcp - runTool', () => {

    beforeEach( async () => {
        jest.clearAllMocks();
    } );

    describe( 'returns errors for invalid requests', () => {

        it(
            'returns 404 when tool does not exist'
            , async () => {

                // send request for non-existent tool
                const result = await request
                    .post( '/mcp' )
                    .set( ...getServiceAuthHeader() )
                    .send( buildMcpRequest( 'runTool', { id: 'nonexistent_tool', input: {} } ) );

                // check result
                expect( result.body ).toMatchObject( {
                    code: 'MCP_TOOL_NOT_FOUND'
                    , statusCode: 404
                } );

                // check status code
                expect( result.status ).toBe( 404 );

            }
        );

    } );

    describe( 'runs tools successfully', () => {

        it(
            'returns 200 with output for summarize tool'
            , async () => {

                // send request to run summarize tool
                const result = await request
                    .post( '/mcp' )
                    .set( ...getServiceAuthHeader() )
                    .send( buildMcpRequest( 'runTool', {
                        id: 'tool_summarize'
                        , input: { text: 'This is a test text that needs to be summarized.' }
                    } ) );

                // check result structure
                expect( result.body ).toHaveProperty( 'result' );
                expect( result.body.result ).toHaveProperty( 'output' );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

        it(
            'returns 200 with output for extract_json tool'
            , async () => {

                // send request to run extract_json tool
                const result = await request
                    .post( '/mcp' )
                    .set( ...getServiceAuthHeader() )
                    .send( buildMcpRequest( 'runTool', {
                        id: 'tool_extract_json'
                        , input: { text: '{"name": "test", "value": 123}' }
                    } ) );

                // check result structure
                expect( result.body ).toHaveProperty( 'result' );
                expect( result.body.result ).toHaveProperty( 'output' );

                // check status code
                expect( result.status ).toBe( 200 );

            }
        );

    } );

} );

/**
 * Error classes unit tests
 */
describe( 'MCP error classes', () => {

    it(
        'MCPToolNotFound has correct properties'
        , () => {

            // create error instance
            const err = new MCPToolNotFound();

            // check properties
            expect( err.clientMessage ).toBe( 'Tool not found.' );
            expect( err.code ).toBe( 'MCP_TOOL_NOT_FOUND' );
            expect( err.statusCode ).toBe( 404 );

        }
    );

    it(
        'MCPMethodNotFound has correct properties'
        , () => {

            // create error instance
            const err = new MCPMethodNotFound();

            // check properties
            expect( err.clientMessage ).toBe( 'MCP method not found.' );
            expect( err.code ).toBe( 'MCP_METHOD_NOT_FOUND' );
            expect( err.statusCode ).toBe( 400 );

        }
    );

    it(
        'MCPToolExecutionFailed has correct properties'
        , () => {

            // create error instance
            const err = new MCPToolExecutionFailed();

            // check properties
            expect( err.clientMessage ).toBe( 'Tool execution failed.' );
            expect( err.code ).toBe( 'MCP_TOOL_EXECUTION_FAILED' );
            expect( err.statusCode ).toBe( 500 );

        }
    );

} );
