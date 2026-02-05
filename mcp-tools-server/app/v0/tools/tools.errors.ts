import { ResourceError } from '../../../errors';

export class MCPToolNotFound extends ResourceError {
    public constructor () {
        super( {
            message: 'Tool not found.'
            , clientMessage: 'Tool not found.'
            , statusCode: 404
            , code: 'MCP_TOOL_NOT_FOUND'
        } );
    }
}

export class MCPMethodNotFound extends ResourceError {
    public constructor () {
        super( {
            message: 'MCP method not found.'
            , clientMessage: 'MCP method not found.'
            , statusCode: 400
            , code: 'MCP_METHOD_NOT_FOUND'
        } );
    }
}

export class MCPToolExecutionFailed extends ResourceError {
    public constructor () {
        super( {
            message: 'Tool execution failed.'
            , clientMessage: 'Tool execution failed.'
            , statusCode: 500
            , code: 'MCP_TOOL_EXECUTION_FAILED'
        } );
    }
}
