/**
 * Unit tests for network-dependent tool executors
 *
 * These tests mock the global fetch function to test web_search, read_url, and http_request
 */
import {
    executeWebSearch
    , executeReadUrl
    , executeHttpRequest
} from '../../app/v0/tools/tools.executors';
import { MCPToolExecutionFailed } from '../../app/v0/tools/tools.errors';

// Store original fetch
const originalFetch = global.fetch;

// Mock fetch helper
const mockFetch = ( response: {
    text?: string;
    status?: number;
    headers?: Record<string, string>;
    ok?: boolean;
} ) => {
    const mockHeaders = new Map( Object.entries( response.headers ?? {} ) );
    global.fetch = jest.fn().mockResolvedValue( {
        text: jest.fn().mockResolvedValue( response.text ?? '' )
        , arrayBuffer: jest.fn().mockResolvedValue(
            new TextEncoder().encode( response.text ?? '' ).buffer
        )
        , status: response.status ?? 200
        , ok: response.ok ?? true
        , headers: {
            get: ( key: string ) => mockHeaders.get( key.toLowerCase() ) ?? null
            , forEach: ( cb: ( value: string, key: string ) => void ) => {
                mockHeaders.forEach( ( value, key ) => cb( value, key ) );
            }
        }
    } );
};

// Mock fetch to reject
const mockFetchError = ( error: Error ) => {
    global.fetch = jest.fn().mockRejectedValue( error );
};

describe( 'executeWebSearch', () => {

    afterEach( () => {
        global.fetch = originalFetch;
        jest.clearAllMocks();
    } );

    describe( 'searches the web and parses results', () => {

        it(
            'returns parsed search results from DuckDuckGo HTML'
            , async () => {

                // mock DuckDuckGo response HTML
                const mockHtml = `
                    <html>
                        <a class="result__a" href="https://example.com/page1">Example Page 1</a>
                        <a class="result__snippet">This is the first result snippet</a>
                        <a class="result__a" href="https://example.com/page2">Example Page 2</a>
                        <a class="result__snippet">This is the second result snippet</a>
                    </html>
                `;
                mockFetch( { text: mockHtml } );

                // execute search
                const result = await executeWebSearch( { query: 'test query' } );

                // verify fetch was called with correct URL
                expect( global.fetch ).toHaveBeenCalledWith(
                    expect.stringContaining( 'duckduckgo.com/html/?q=test%20query' )
                    , expect.any( Object )
                );

                // verify results structure
                expect( result ).toHaveProperty( 'results' );
                expect( Array.isArray( result.results ) ).toBe( true );
                expect( result.results.length ).toBe( 2 );

                // verify first result
                expect( result.results[ 0 ] ).toMatchObject( {
                    title: 'Example Page 1'
                    , url: 'https://example.com/page1'
                    , snippet: 'This is the first result snippet'
                } );

            }
        );

        it(
            'respects limit parameter'
            , async () => {

                // mock response with many results
                const mockHtml = `
                    <html>
                        <a class="result__a" href="https://example.com/1">Result 1</a>
                        <a class="result__snippet">Snippet 1</a>
                        <a class="result__a" href="https://example.com/2">Result 2</a>
                        <a class="result__snippet">Snippet 2</a>
                        <a class="result__a" href="https://example.com/3">Result 3</a>
                        <a class="result__snippet">Snippet 3</a>
                    </html>
                `;
                mockFetch( { text: mockHtml } );

                // execute search with limit
                const result = await executeWebSearch( { query: 'test', limit: 2 } );

                // verify limit respected
                expect( result.results.length ).toBeLessThanOrEqual( 2 );

            }
        );

        it(
            'returns empty results when no matches found'
            , async () => {

                // mock empty response
                mockFetch( { text: '<html><body>No results</body></html>' } );

                // execute search
                const result = await executeWebSearch( { query: 'nonexistent' } );

                // verify empty results
                expect( result.results ).toEqual( [] );

            }
        );

        it(
            'throws error when fetch fails'
            , async () => {

                mockFetchError( new Error( 'Network error' ) );

                await expect( executeWebSearch( { query: 'test' } ) )
                    .rejects.toThrow( MCPToolExecutionFailed );

            }
        );

        it(
            'throws error when query is empty'
            , async () => {

                // execute with empty query
                await expect( executeWebSearch( { query: '' } ) )
                    .rejects.toThrow( MCPToolExecutionFailed );

            }
        );

        it(
            'throws error when query is whitespace only'
            , async () => {

                // execute with whitespace query
                await expect( executeWebSearch( { query: '   ' } ) )
                    .rejects.toThrow( MCPToolExecutionFailed );

            }
        );

        it(
            'decodes HTML entities in results'
            , async () => {

                // mock response with HTML entities
                const mockHtml = `
                    <a class="result__a" href="https://example.com">Title &amp; More</a>
                    <a class="result__snippet">It&apos;s a &quot;test&quot;</a>
                `;
                mockFetch( { text: mockHtml } );

                // execute search
                const result = await executeWebSearch( { query: 'test' } );

                // verify entities decoded
                expect( result.results[ 0 ].title ).toBe( 'Title & More' );

            }
        );

    } );

} );

describe( 'executeReadUrl', () => {

    const originalEnv = process.env.MCP_HTTP_REQUEST_ALLOWLIST;

    beforeEach( () => {
        // Allow test domains by default
        process.env.MCP_HTTP_REQUEST_ALLOWLIST = 'example.com,*.example.com,api.example.com';
    } );

    afterEach( () => {
        global.fetch = originalFetch;
        process.env.MCP_HTTP_REQUEST_ALLOWLIST = originalEnv;
        jest.clearAllMocks();
    } );

    describe( 'fetches and extracts content from URLs', () => {

        it(
            'extracts text content from HTML page'
            , async () => {

                // mock HTML response
                const mockHtml = `
                    <html>
                        <head><title>Test Page Title</title></head>
                        <body>
                            <h1>Hello World</h1>
                            <p>This is paragraph text.</p>
                        </body>
                    </html>
                `;
                mockFetch( {
                    text: mockHtml
                    , headers: { 'content-type': 'text/html' }
                } );

                // execute
                const result = await executeReadUrl( { url: 'https://example.com/page' } );

                // verify result
                expect( result ).toHaveProperty( 'title', 'Test Page Title' );
                expect( result ).toHaveProperty( 'text' );
                expect( result.text ).toContain( 'Hello World' );
                expect( result.text ).toContain( 'This is paragraph text' );

            }
        );

        it(
            'strips script and style tags from HTML'
            , async () => {

                // mock HTML with scripts and styles
                const mockHtml = `
                    <html>
                        <head>
                            <title>Page</title>
                            <style>.class { color: red; }</style>
                        </head>
                        <body>
                            <script>alert('evil');</script>
                            <p>Clean content here</p>
                            <script>console.log('more evil');</script>
                        </body>
                    </html>
                `;
                mockFetch( {
                    text: mockHtml
                    , headers: { 'content-type': 'text/html' }
                } );

                // execute
                const result = await executeReadUrl( { url: 'https://example.com' } );

                // verify scripts/styles removed
                expect( result.text ).not.toContain( 'alert' );
                expect( result.text ).not.toContain( 'evil' );
                expect( result.text ).not.toContain( 'color: red' );
                expect( result.text ).toContain( 'Clean content here' );

            }
        );

        it(
            'respects maxChars parameter'
            , async () => {

                // mock long content
                const longText = 'A'.repeat( 10000 );
                mockFetch( {
                    text: longText
                    , headers: { 'content-type': 'text/plain' }
                } );

                // execute with maxChars
                const result = await executeReadUrl( { url: 'https://example.com', maxChars: 500 } );

                // verify truncated
                expect( result.text.length ).toBe( 500 );

            }
        );

        it(
            'returns plain text for non-HTML content'
            , async () => {

                // mock JSON response
                const jsonContent = '{"key": "value"}';
                mockFetch( {
                    text: jsonContent
                    , headers: { 'content-type': 'application/json' }
                } );

                // execute
                const result = await executeReadUrl( { url: 'https://api.example.com/data' } );

                // verify returns as-is
                expect( result.title ).toBe( '' );
                expect( result.text ).toBe( jsonContent );

            }
        );

        it(
            'throws error for localhost URLs'
            , async () => {

                // clear allowlist to test default blocking behavior
                process.env.MCP_HTTP_REQUEST_ALLOWLIST = '';

                // try localhost
                await expect( executeReadUrl( { url: 'http://localhost:3000/secret' } ) )
                    .rejects.toThrow( MCPToolExecutionFailed );

            }
        );

        it(
            'throws error for private IP addresses'
            , async () => {

                // clear allowlist to test default blocking behavior
                process.env.MCP_HTTP_REQUEST_ALLOWLIST = '';

                // try private IPs
                await expect( executeReadUrl( { url: 'http://192.168.1.1/admin' } ) )
                    .rejects.toThrow( MCPToolExecutionFailed );

                await expect( executeReadUrl( { url: 'http://10.0.0.1/internal' } ) )
                    .rejects.toThrow( MCPToolExecutionFailed );

                await expect( executeReadUrl( { url: 'http://127.0.0.1/local' } ) )
                    .rejects.toThrow( MCPToolExecutionFailed );

            }
        );

        it(
            'throws error for non-HTTP protocols'
            , async () => {

                // try file protocol
                await expect( executeReadUrl( { url: 'file:///etc/passwd' } ) )
                    .rejects.toThrow( MCPToolExecutionFailed );

                // try ftp
                await expect( executeReadUrl( { url: 'ftp://ftp.example.com/file' } ) )
                    .rejects.toThrow( MCPToolExecutionFailed );

            }
        );

        it(
            'allows URLs when in allowlist'
            , async () => {

                // set specific allowlist (overwriting the beforeEach default)
                process.env.MCP_HTTP_REQUEST_ALLOWLIST = 'allowed-domain.com';

                mockFetch( { text: 'Content', headers: { 'content-type': 'text/plain' } } );

                // allowed domain
                const result = await executeReadUrl( { url: 'https://allowed-domain.com/page' } );
                expect( result.text ).toBe( 'Content' );

            }
        );

        it(
            'blocks URLs not in allowlist when allowlist is set'
            , async () => {

                // set specific allowlist that doesn't include example.com
                process.env.MCP_HTTP_REQUEST_ALLOWLIST = 'other-domain.com';

                // blocked domain
                await expect( executeReadUrl( { url: 'https://example.com/page' } ) )
                    .rejects.toThrow( MCPToolExecutionFailed );

            }
        );

    } );

} );

describe( 'executeHttpRequest', () => {

    const originalEnv = process.env.MCP_HTTP_REQUEST_ALLOWLIST;

    beforeEach( () => {
        // Allow test domains by default
        process.env.MCP_HTTP_REQUEST_ALLOWLIST = 'example.com,*.example.com,api.example.com';
    } );

    afterEach( () => {
        global.fetch = originalFetch;
        process.env.MCP_HTTP_REQUEST_ALLOWLIST = originalEnv;
        jest.clearAllMocks();
    } );

    describe( 'makes HTTP requests with various methods', () => {

        it(
            'makes GET request and returns response'
            , async () => {

                // mock response
                mockFetch( {
                    text: '{"data": "value"}'
                    , status: 200
                    , headers: { 'content-type': 'application/json' }
                } );

                // execute GET
                const result = await executeHttpRequest( {
                    url: 'https://api.example.com/data'
                    , method: 'GET'
                } );

                // verify fetch called correctly
                expect( global.fetch ).toHaveBeenCalledWith(
                    'https://api.example.com/data'
                    , expect.objectContaining( { method: 'GET' } )
                );

                // verify response
                expect( result.status ).toBe( 200 );
                expect( result.body ).toBe( '{"data": "value"}' );
                expect( result.headers ).toHaveProperty( 'content-type', 'application/json' );

            }
        );

        it(
            'makes POST request with JSON body'
            , async () => {

                // mock response
                mockFetch( { text: '{"success": true}', status: 201 } );

                // execute POST
                const result = await executeHttpRequest( {
                    url: 'https://api.example.com/create'
                    , method: 'POST'
                    , body: { name: 'test', value: 123 }
                } );

                // verify fetch called with body
                expect( global.fetch ).toHaveBeenCalledWith(
                    'https://api.example.com/create'
                    , expect.objectContaining( {
                        method: 'POST'
                        , body: '{"name":"test","value":123}'
                        , headers: expect.objectContaining( {
                            'Content-Type': 'application/json'
                        } )
                    } )
                );

                // verify response
                expect( result.status ).toBe( 201 );

            }
        );

        it(
            'makes PUT request with string body'
            , async () => {

                // mock response
                mockFetch( { text: 'Updated', status: 200 } );

                // execute PUT
                await executeHttpRequest( {
                    url: 'https://api.example.com/update'
                    , method: 'PUT'
                    , body: 'raw string body'
                } );

                // verify fetch called with string body
                expect( global.fetch ).toHaveBeenCalledWith(
                    'https://api.example.com/update'
                    , expect.objectContaining( {
                        method: 'PUT'
                        , body: 'raw string body'
                    } )
                );

            }
        );

        it(
            'makes DELETE request'
            , async () => {

                // mock response
                mockFetch( { text: '', status: 204 } );

                // execute DELETE
                const result = await executeHttpRequest( {
                    url: 'https://api.example.com/resource/123'
                    , method: 'DELETE'
                } );

                // verify
                expect( global.fetch ).toHaveBeenCalledWith(
                    'https://api.example.com/resource/123'
                    , expect.objectContaining( { method: 'DELETE' } )
                );
                expect( result.status ).toBe( 204 );

            }
        );

        it(
            'includes custom headers in request'
            , async () => {

                // mock response
                mockFetch( { text: 'OK', status: 200 } );

                // execute with custom headers
                await executeHttpRequest( {
                    url: 'https://api.example.com/auth'
                    , method: 'GET'
                    , headers: {
                        'Authorization': 'Bearer token123'
                        , 'X-Custom-Header': 'custom-value'
                    }
                } );

                // verify headers sent
                expect( global.fetch ).toHaveBeenCalledWith(
                    'https://api.example.com/auth'
                    , expect.objectContaining( {
                        headers: expect.objectContaining( {
                            'Authorization': 'Bearer token123'
                            , 'X-Custom-Header': 'custom-value'
                        } )
                    } )
                );

            }
        );

        it(
            'handles 4xx error responses'
            , async () => {

                // mock 404 response
                mockFetch( {
                    text: '{"error": "Not found"}'
                    , status: 404
                    , ok: false
                } );

                // execute
                const result = await executeHttpRequest( {
                    url: 'https://api.example.com/missing'
                    , method: 'GET'
                } );

                // verify error status returned (not thrown)
                expect( result.status ).toBe( 404 );
                expect( result.body ).toContain( 'Not found' );

            }
        );

        it(
            'handles 5xx error responses'
            , async () => {

                // mock 500 response
                mockFetch( {
                    text: 'Internal Server Error'
                    , status: 500
                    , ok: false
                } );

                // execute
                const result = await executeHttpRequest( {
                    url: 'https://api.example.com/broken'
                    , method: 'GET'
                } );

                // verify error status returned
                expect( result.status ).toBe( 500 );

            }
        );

        it(
            'does not send body for GET requests'
            , async () => {

                // mock response
                mockFetch( { text: 'OK', status: 200 } );

                // execute GET with body (should be ignored)
                await executeHttpRequest( {
                    url: 'https://api.example.com/data'
                    , method: 'GET'
                    , body: { ignored: true }
                } );

                // verify no body sent
                expect( global.fetch ).toHaveBeenCalledWith(
                    'https://api.example.com/data'
                    , expect.objectContaining( {
                        method: 'GET'
                        , body: undefined
                    } )
                );

            }
        );

        it(
            'throws error for localhost URLs'
            , async () => {

                // clear allowlist to test default blocking behavior
                process.env.MCP_HTTP_REQUEST_ALLOWLIST = '';

                await expect( executeHttpRequest( {
                    url: 'http://localhost:8080/api'
                    , method: 'GET'
                } ) ).rejects.toThrow( MCPToolExecutionFailed );

            }
        );

        it(
            'throws error for private IP addresses'
            , async () => {

                // clear allowlist to test default blocking behavior
                process.env.MCP_HTTP_REQUEST_ALLOWLIST = '';

                await expect( executeHttpRequest( {
                    url: 'http://172.16.0.1/internal'
                    , method: 'GET'
                } ) ).rejects.toThrow( MCPToolExecutionFailed );

            }
        );

        it(
            'normalizes method to uppercase'
            , async () => {

                // mock response
                mockFetch( { text: 'OK', status: 200 } );

                // execute with lowercase method
                await executeHttpRequest( {
                    url: 'https://api.example.com/data'
                    , method: 'post'
                    , body: {}
                } );

                // verify method normalized
                expect( global.fetch ).toHaveBeenCalledWith(
                    expect.any( String )
                    , expect.objectContaining( { method: 'POST' } )
                );

            }
        );

        it(
            'truncates large response bodies'
            , async () => {

                // mock very large response (> 20KB)
                const largeBody = 'X'.repeat( 30000 );
                mockFetch( { text: largeBody, status: 200 } );

                // execute
                const result = await executeHttpRequest( {
                    url: 'https://api.example.com/large'
                    , method: 'GET'
                } );

                // verify truncated to 20KB
                expect( result.body.length ).toBeLessThanOrEqual( 20000 );

            }
        );

    } );

} );
