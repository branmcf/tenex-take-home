import { ResourceError } from '../../errors';

export class ToolsFetchFailed extends ResourceError {
    public constructor () {
        super( {
            message: 'Failed to fetch tools.'
            , clientMessage: 'Failed to fetch tools.'
            , statusCode: 500
            , code: 'TOOLS_FETCH_FAILED'
        } );
    }
}

export class ToolNotFound extends ResourceError {
    public constructor () {
        super( {
            message: 'Tool not found.'
            , clientMessage: 'Tool not found.'
            , statusCode: 404
            , code: 'TOOL_NOT_FOUND'
        } );
    }
}
