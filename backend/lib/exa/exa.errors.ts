import { ResourceError } from '../../errors';

/**
 * custom error for Exa search failures
 */
export class ExaSearchFailed extends ResourceError {
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