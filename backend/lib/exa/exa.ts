import Exa from 'exa-js';
import {
    Either
    , error
    , success
} from '../../types';
import { ResourceError } from '../../errors';
import type {
    ExaSearchParams
    , ExaSearchResult
} from './exa.types';

/**
 * custom error for Exa search failures
 */
class ExaSearchFailed extends ResourceError {
    public constructor () {
        const clientMessage = `Failed to search with Exa.`;
        const code = 'EXA_SEARCH_FAILED';
        const statusCode = 500;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

/**
 * search the web using Exa's neural search
 *
 * @param params - search parameters
 * @returns Either with search results or error
 */
export const searchWeb = async (
    params: ExaSearchParams
): Promise<Either<ResourceError, ExaSearchResult[]>> => {

    // check if Exa API key is available
    const exaApiKey = process.env.EXA_API_KEY;

    // if no API key, return error
    if ( !exaApiKey ) {

        // log warning about missing API key
        // eslint-disable-next-line no-console
        console.warn( '[Exa] EXA_API_KEY not found in environment variables' );

        // return error for missing API key
        return error( new ExaSearchFailed() );
    }

    try {

        // log search attempt
        // eslint-disable-next-line no-console
        console.log( `[Exa] Searching for: "${params.query}"` );

        // initialize Exa client
        const exa = new Exa( exaApiKey );

        // search for relevant sources using Exa
        const searchResult = await exa.search( params.query, {
            type: params.type ?? 'auto'
            , useAutoprompt: params.useAutoprompt ?? true
            , numResults: params.numResults ?? 3
            , contents: {
                text: {
                    maxCharacters: params.textMaxCharacters ?? 2000
                    , includeHtmlTags: false
                }
            }
        } );

        // log successful search
        // eslint-disable-next-line no-console
        console.log( `[Exa] Found ${searchResult.results.length} results` );

        // map Exa results to our format
        const results: ExaSearchResult[] = searchResult.results
            .filter( result => result.title )
            .map( result => ( {
                url: result.url
                , title: result.title as string
                , text: result.text ?? undefined
            } ) );

        // return success with results
        return success( results );

    } catch ( err ) {

        // log the error
        // eslint-disable-next-line no-console
        console.error( '[Exa] Search failed:', err );

        // return error on failure
        return error( new ExaSearchFailed() );

    }

};
