/**
 * Unit tests for tools.helper.ts
 */
import {
    listToolsHelper
    , searchToolsHelper
    , getToolHelper
    , runToolHelper
} from '../../app/v0/tools/tools.helper';

/**
 * listToolsHelper
 */
describe( 'listToolsHelper', () => {

    describe( 'wraps listTools in Either', () => {

        it(
            'returns success Either with tools'
            , () => {

                // call helper
                const result = listToolsHelper( {} );

                // check Either
                expect( result.isError() ).toBe( false );
                expect( result.value ).toHaveProperty( 'tools' );
                expect( result.value ).toHaveProperty( 'nextCursor' );

            }
        );

        it(
            'passes params to underlying service'
            , () => {

                // call with limit
                const result = listToolsHelper( { limit: 2 } );

                // check limit respected
                expect( result.isError() ).toBe( false );
                if ( !result.isError() ) {
                    expect( result.value.tools.length ).toBeLessThanOrEqual( 2 );
                }

            }
        );

    } );

} );

/**
 * searchToolsHelper
 */
describe( 'searchToolsHelper', () => {

    describe( 'wraps searchTools in Either', () => {

        it(
            'returns success Either with tools'
            , () => {

                // call helper
                const result = searchToolsHelper( { query: 'search' } );

                // check Either
                expect( result.isError() ).toBe( false );
                expect( result.value ).toHaveProperty( 'tools' );

            }
        );

        it(
            'returns empty array for non-matching query'
            , () => {

                // search for non-existent
                const result = searchToolsHelper( { query: 'nonexistentxyz' } );

                // check result
                expect( result.isError() ).toBe( false );
                if ( !result.isError() ) {
                    expect( result.value.tools ).toEqual( [] );
                }

            }
        );

    } );

} );

/**
 * getToolHelper
 */
describe( 'getToolHelper', () => {

    describe( 'wraps getTool in Either', () => {

        it(
            'returns success Either when tool found'
            , () => {

                // get known tool
                const result = getToolHelper( { id: 'tool_web_search' } );

                // check Either
                expect( result.isError() ).toBe( false );
                if ( !result.isError() ) {
                    expect( result.value.tool.id ).toBe( 'tool_web_search' );
                }

            }
        );

        it(
            'returns error Either when tool not found'
            , () => {

                // get non-existent tool
                const result = getToolHelper( { id: 'nonexistent_tool' } );

                // check Either
                expect( result.isError() ).toBe( true );
                if ( result.isError() ) {
                    expect( result.value.code ).toBe( 'MCP_TOOL_NOT_FOUND' );
                    expect( result.value.statusCode ).toBe( 404 );
                }

            }
        );

        it(
            'returns error Either when version mismatch'
            , () => {

                // get tool with wrong version
                const result = getToolHelper( { id: 'tool_web_search', version: '99.0.0' } );

                // check Either
                expect( result.isError() ).toBe( true );
                if ( result.isError() ) {
                    expect( result.value.code ).toBe( 'MCP_TOOL_NOT_FOUND' );
                }

            }
        );

    } );

} );

/**
 * runToolHelper
 */
describe( 'runToolHelper', () => {

    describe( 'executes tools and returns Either', () => {

        it(
            'returns error when tool not found'
            , async () => {

                // run non-existent tool
                const result = await runToolHelper( {
                    id: 'nonexistent_tool'
                    , input: {}
                } );

                // check Either
                expect( result.isError() ).toBe( true );
                if ( result.isError() ) {
                    expect( result.value.code ).toBe( 'MCP_TOOL_NOT_FOUND' );
                }

            }
        );

        it(
            'executes summarize tool successfully'
            , async () => {

                // run summarize
                const result = await runToolHelper( {
                    id: 'tool_summarize'
                    , input: { text: 'Test text to summarize.' }
                } );

                // check Either
                expect( result.isError() ).toBe( false );
                if ( !result.isError() ) {
                    expect( result.value ).toHaveProperty( 'output' );
                    expect( result.value.output ).toHaveProperty( 'summary' );
                }

            }
        );

        it(
            'executes extract_json tool successfully'
            , async () => {

                // run extract_json
                const result = await runToolHelper( {
                    id: 'tool_extract_json'
                    , input: { text: '{"key": "value"}' }
                } );

                // check Either
                expect( result.isError() ).toBe( false );
                if ( !result.isError() ) {
                    expect( result.value ).toHaveProperty( 'output' );
                    expect( result.value.output ).toHaveProperty( 'data' );
                }

            }
        );

        it(
            'respects version parameter'
            , async () => {

                // run with wrong version
                const result = await runToolHelper( {
                    id: 'tool_summarize'
                    , version: '99.0.0'
                    , input: { text: 'Test' }
                } );

                // check Either - should fail
                expect( result.isError() ).toBe( true );
                if ( result.isError() ) {
                    expect( result.value.code ).toBe( 'MCP_TOOL_NOT_FOUND' );
                }

            }
        );

    } );

} );
