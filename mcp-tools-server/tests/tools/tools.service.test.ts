/**
 * Unit tests for tools.service.ts
 */
import {
    listTools
    , searchTools
    , getTool
} from '../../app/v0/tools/tools.service';

/**
 * listTools
 */
describe( 'listTools', () => {

    describe( 'returns tools with pagination', () => {

        it(
            'returns all tools when no params provided'
            , () => {

                // call listTools with defaults
                const result = listTools( {} );

                // check result structure
                expect( result ).toHaveProperty( 'tools' );
                expect( result ).toHaveProperty( 'nextCursor' );
                expect( Array.isArray( result.tools ) ).toBe( true );

            }
        );

        it(
            'respects limit parameter'
            , () => {

                // call with limit
                const result = listTools( { limit: 2 } );

                // check result
                expect( result.tools.length ).toBeLessThanOrEqual( 2 );

            }
        );

        it(
            'returns null nextCursor when all tools returned'
            , () => {

                // call with large limit
                const result = listTools( { limit: 100 } );

                // check nextCursor is null
                expect( result.nextCursor ).toBeNull();

            }
        );

        it(
            'returns nextCursor when more tools available'
            , () => {

                // call with small limit
                const result = listTools( { limit: 1 } );

                // check nextCursor is set
                expect( result.nextCursor ).toBe( '1' );

            }
        );

        it(
            'uses cursor for pagination'
            , () => {

                // get first page
                const page1 = listTools( { limit: 1 } );

                // get second page using cursor
                const page2 = listTools( { cursor: page1.nextCursor, limit: 1 } );

                // verify different tools returned
                expect( page2.tools[ 0 ].id ).not.toBe( page1.tools[ 0 ].id );

            }
        );

    } );

} );

/**
 * searchTools
 */
describe( 'searchTools', () => {

    describe( 'searches tools by query', () => {

        it(
            'finds tools matching name'
            , () => {

                // search for 'web'
                const result = searchTools( { query: 'web' } );

                // check results
                expect( result.tools.length ).toBeGreaterThan( 0 );
                const hasMatch = result.tools.some( tool =>
                    tool.name.toLowerCase().includes( 'web' )
                );
                expect( hasMatch ).toBe( true );

            }
        );

        it(
            'finds tools matching description'
            , () => {

                // search for 'extract'
                const result = searchTools( { query: 'extract' } );

                // check results
                expect( result.tools.length ).toBeGreaterThan( 0 );
                const hasMatch = result.tools.some( tool =>
                    tool.description?.toLowerCase().includes( 'extract' )
                );
                expect( hasMatch ).toBe( true );

            }
        );

        it(
            'finds tools matching tags'
            , () => {

                // search for 'search' tag
                const result = searchTools( { query: 'search' } );

                // check results contain tool with search tag
                expect( result.tools.length ).toBeGreaterThan( 0 );

            }
        );

        it(
            'returns empty array for non-matching query'
            , () => {

                // search for non-existent term
                const result = searchTools( { query: 'nonexistenttermxyz123' } );

                // check empty results
                expect( result.tools ).toEqual( [] );

            }
        );

        it(
            'respects limit parameter'
            , () => {

                // search with limit
                const result = searchTools( { query: 'tool', limit: 1 } );

                // check limit respected
                expect( result.tools.length ).toBeLessThanOrEqual( 1 );

            }
        );

        it(
            'is case-insensitive'
            , () => {

                // search with uppercase
                const resultUpper = searchTools( { query: 'WEB' } );
                // search with lowercase
                const resultLower = searchTools( { query: 'web' } );

                // check same results
                expect( resultUpper.tools.length ).toBe( resultLower.tools.length );

            }
        );

    } );

} );

/**
 * getTool
 */
describe( 'getTool', () => {

    describe( 'retrieves tools by id', () => {

        it(
            'returns tool when id exists'
            , () => {

                // get known tool
                const result = getTool( { id: 'tool_web_search' } );

                // check result
                expect( result ).not.toBeNull();
                expect( result?.id ).toBe( 'tool_web_search' );
                expect( result?.name ).toBe( 'web_search' );

            }
        );

        it(
            'returns null when id does not exist'
            , () => {

                // get non-existent tool
                const result = getTool( { id: 'nonexistent_tool' } );

                // check result
                expect( result ).toBeNull();

            }
        );

        it(
            'returns tool when version matches'
            , () => {

                // get tool with correct version
                const result = getTool( { id: 'tool_web_search', version: '1.0.0' } );

                // check result
                expect( result ).not.toBeNull();
                expect( result?.version ).toBe( '1.0.0' );

            }
        );

        it(
            'returns null when version does not match'
            , () => {

                // get tool with wrong version
                const result = getTool( { id: 'tool_web_search', version: '99.0.0' } );

                // check result
                expect( result ).toBeNull();

            }
        );

        it(
            'ignores version when not specified'
            , () => {

                // get tool without version
                const result = getTool( { id: 'tool_summarize' } );

                // check result - should return regardless of version
                expect( result ).not.toBeNull();
                expect( result?.id ).toBe( 'tool_summarize' );

            }
        );

    } );

} );
