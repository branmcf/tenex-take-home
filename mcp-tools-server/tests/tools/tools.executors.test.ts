/**
 * Unit tests for tools.executors.ts
 *
 * Tests for the local executor functions (summarize, extract_json)
 * Network-dependent executors (web_search, read_url, http_request) are tested separately
 */
import {
    executeSummarize
    , executeExtractJson
} from '../../app/v0/tools/tools.executors';

/**
 * executeSummarize
 */
describe( 'executeSummarize', () => {

    describe( 'summarizes text correctly', () => {

        it(
            'returns summary from text'
            , async () => {

                // summarize text
                const result = await executeSummarize( {
                    text: 'This is a test sentence. Another sentence here. And a third one.'
                } );

                // check result structure
                expect( result ).toHaveProperty( 'summary' );
                expect( typeof result.summary ).toBe( 'string' );

            }
        );

        it(
            'respects maxWords parameter when above minimum'
            , async () => {

                // generate text with many words
                const longText = Array( 100 ).fill( 'Word' ).join( ' ' ) + '.';

                // summarize with maxWords above minimum (30)
                const result = await executeSummarize( {
                    text: longText
                    , maxWords: 40
                } );

                // check word count is within limit
                const wordCount = result.summary.split( ' ' ).length;
                expect( wordCount ).toBeLessThanOrEqual( 40 );

            }
        );

        it(
            'handles empty text'
            , async () => {

                // summarize empty text
                const result = await executeSummarize( { text: '' } );

                // check empty summary
                expect( result.summary ).toBe( '' );

            }
        );

        it(
            'handles whitespace-only text'
            , async () => {

                // summarize whitespace
                const result = await executeSummarize( { text: '   \n\t  ' } );

                // check empty summary
                expect( result.summary ).toBe( '' );

            }
        );

        it(
            'extracts first sentences for summary'
            , async () => {

                // text with multiple sentences
                const text = 'First sentence. Second sentence. Third sentence. Fourth sentence.';
                const result = await executeSummarize( { text } );

                // summary should contain first sentences
                expect( result.summary ).toContain( 'First sentence' );

            }
        );

        it(
            'uses default maxWords when not specified'
            , async () => {

                // long text
                const text = Array( 200 ).fill( 'word' ).join( ' ' );
                const result = await executeSummarize( { text } );

                // check that result is truncated (default is 120 words)
                const wordCount = result.summary.split( ' ' ).length;
                expect( wordCount ).toBeLessThanOrEqual( 120 );

            }
        );

        it(
            'clamps maxWords to valid range'
            , async () => {

                // try very small maxWords
                const result = await executeSummarize( { text: 'A B C D E F G', maxWords: 1 } );

                // should use minimum of 30
                expect( result.summary.length ).toBeGreaterThan( 0 );

            }
        );

    } );

} );

/**
 * executeExtractJson
 */
describe( 'executeExtractJson', () => {

    describe( 'extracts JSON from text', () => {

        it(
            'extracts simple JSON object'
            , async () => {

                // text with JSON
                const text = '{"name": "test", "value": 123}';
                const result = await executeExtractJson( { text } );

                // check result
                expect( result.data ).toEqual( { name: 'test', value: 123 } );

            }
        );

        it(
            'extracts JSON array'
            , async () => {

                // text with JSON array
                const text = '[1, 2, 3]';
                const result = await executeExtractJson( { text } );

                // check result
                expect( result.data ).toEqual( [ 1, 2, 3 ] );

            }
        );

        it(
            'extracts JSON from mixed text'
            , async () => {

                // text with surrounding content
                const text = 'Here is some data: {"key": "value"} and more text';
                const result = await executeExtractJson( { text } );

                // check result
                expect( result.data ).toEqual( { key: 'value' } );

            }
        );

        it(
            'returns null for text without JSON'
            , async () => {

                // text without JSON
                const text = 'Just plain text without any JSON';
                const result = await executeExtractJson( { text } );

                // check result
                expect( result.data ).toBeNull();

            }
        );

        it(
            'handles nested JSON objects'
            , async () => {

                // nested JSON
                const text = '{"outer": {"inner": {"deep": 42}}}';
                const result = await executeExtractJson( { text } );

                // check result
                expect( result.data ).toEqual( { outer: { inner: { deep: 42 } } } );

            }
        );

        it(
            'picks specified fields from result'
            , async () => {

                // JSON with multiple fields
                const text = '{"name": "test", "age": 25, "city": "NYC"}';
                const result = await executeExtractJson( { text, fields: [ 'name', 'age' ] } );

                // check only specified fields
                expect( result.data ).toEqual( { name: 'test', age: 25 } );
                expect( result.data ).not.toHaveProperty( 'city' );

            }
        );

        it(
            'returns full data when fields is empty'
            , async () => {

                // JSON with fields param empty
                const text = '{"a": 1, "b": 2}';
                const result = await executeExtractJson( { text, fields: [] } );

                // check all fields returned
                expect( result.data ).toEqual( { a: 1, b: 2 } );

            }
        );

        it(
            'handles strings with escaped quotes'
            , async () => {

                // JSON with escaped quotes
                const text = '{"message": "He said \\"hello\\""}';
                const result = await executeExtractJson( { text } );

                // check result
                expect( result.data ).toEqual( { message: 'He said "hello"' } );

            }
        );

        it(
            'handles empty text'
            , async () => {

                // empty text
                const result = await executeExtractJson( { text: '' } );

                // check result
                expect( result.data ).toBeNull();

            }
        );

        it(
            'handles invalid JSON gracefully'
            , async () => {

                // malformed JSON
                const text = '{invalid json here}';
                const result = await executeExtractJson( { text } );

                // check result - should not crash
                expect( result.data ).toBeNull();

            }
        );

    } );

} );
