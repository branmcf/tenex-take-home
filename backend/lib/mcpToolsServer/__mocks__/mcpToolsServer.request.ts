import {
    Either
    , success
} from '../../../types';
import type {
    MCPGetToolResponse
    , MCPListToolsResponse
    , MCPSearchToolsResponse
} from '../mcpToolsServer.types';

export const listMcpTools = async (): Promise<Either<never, MCPListToolsResponse>> => {
    return success( { tools: [], nextCursor: null } );
};

export const searchMcpTools = async (): Promise<Either<never, MCPSearchToolsResponse>> => {
    return success( { tools: [] } );
};

export const getMcpTool = async (): Promise<Either<never, MCPGetToolResponse>> => {
    return success( {
        tool: {
            id: 'tool_mock'
            , name: 'Mock Tool'
            , description: null
            , schema: {}
            , version: '1.0.0'
            , tags: []
        }
    } );
};
