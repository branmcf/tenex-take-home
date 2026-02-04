import { ResourceError } from '../../errors';

export class MCPToolsRequestFailed extends ResourceError {
    public constructor () {
        super( {
            message: 'Failed to call MCP tools service.'
            , clientMessage: 'Failed to call MCP tools service.'
            , statusCode: 500
            , code: 'MCP_TOOLS_REQUEST_FAILED'
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

export class MCPToolNotFound extends ResourceError {
    public constructor () {
        super( {
            message: 'Tool not found in MCP.'
            , clientMessage: 'Tool not found in MCP.'
            , statusCode: 404
            , code: 'MCP_TOOL_NOT_FOUND'
        } );
    }
}

export class MCPToolExecutionFailed extends ResourceError {
    public constructor () {
        super( {
            message: 'Tool execution failed in MCP.'
            , clientMessage: 'Tool execution failed in MCP.'
            , statusCode: 500
            , code: 'MCP_TOOL_EXECUTION_FAILED'
        } );
    }
}
