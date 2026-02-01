import { jsonParse } from '../json';

/**
 * parses ISO strings with millisecond precision
 * into JS Date objects
 */
const jsonParseReviver = ( key: string, value: unknown ): unknown => {
    const isDate = typeof value === 'string'
        && ( /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/ ).test( value );

    if ( isDate ) return new Date( value );

    return value;
};

export const axiosResponseSerializer = ( data: string ): unknown => {

    if ( !data ) return {};

    const jsonParseResult = jsonParse( data, jsonParseReviver );

    if ( jsonParseResult.isError() ) {
        throw jsonParseResult.value;
    }

    return jsonParseResult.value;
};