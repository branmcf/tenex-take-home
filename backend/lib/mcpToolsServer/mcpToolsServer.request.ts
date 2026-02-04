import axios, { AxiosError } from 'axios';
import {
    Either
    , error
    , success
} from '../../types';
import { ResourceError } from '../../errors';
import { getCurrentRequestId } from '../../utils/requestId';
import {
    MCPGetToolResponse
    , MCPListToolsResponse
    , MCPSearchToolsResponse
    , MCPRunToolResponse
    , MCPRequestParams
    , MCPResponse
} from './mcpToolsServer.types';
import {
    MCPMethodNotFound
    , MCPToolNotFound
    , MCPToolExecutionFailed
    , MCPToolsRequestFailed
} from './mcpToolsServer.errors';

const getBaseUrl = () => {
    return process.env.MCP_TOOLS_URL ?? 'http://localhost:4010';
};

const getServiceKey = () => {
    return process.env.MCP_TOOLS_API_KEY ?? '';
};

const axiosInstance = axios.create( {
    headers: {
        'Content-Type': 'application/json'
        , 'x-service-key': getServiceKey()
    }
    , baseURL: getBaseUrl()
} );

const mcpToolsRequest = async <T>(
    payload: MCPRequestParams<unknown>
): Promise<Either<ResourceError, T>> => {

    // short-circuit for integration tests
    if ( process.env.IS_INTEGRATION_TESTING === 'true' ) {
        return success( {} as T );
    }

    // build request headers with request id
    const requestId = getCurrentRequestId();
    const headers: Record<string, string> = {};

    if ( requestId ) {
        headers[ 'x-request-id' ] = requestId;
    }

    try {
        const response = await axiosInstance.post<MCPResponse<T>>( '/mcp', payload, { headers } );

        return success( response.data.result );
    } catch ( err ) {
        const response = ( err as AxiosError )?.response;
        const errorCode = response?.data && typeof response.data === 'object'
            ? ( response.data as { code?: string } ).code
            : undefined;

        const errorCodesMap = new Map<string, ResourceError>( [
            [ 'MCP_METHOD_NOT_FOUND', new MCPMethodNotFound() ]
            , [ 'MCP_TOOL_NOT_FOUND', new MCPToolNotFound() ]
            , [ 'MCP_TOOL_EXECUTION_FAILED', new MCPToolExecutionFailed() ]
        ] );

        const mappedError = errorCode ? errorCodesMap.get( errorCode ) : undefined;

        if ( mappedError ) {
            return error( mappedError );
        }

        return error( new MCPToolsRequestFailed() );
    }
};

export const listMcpTools = async (
    params: { cursor?: string | null; limit?: number }
): Promise<Either<ResourceError, MCPListToolsResponse>> => {

    return mcpToolsRequest<MCPListToolsResponse>( {
        method: 'listTools'
        , params
    } );

};

export const searchMcpTools = async (
    params: { query: string; limit?: number }
): Promise<Either<ResourceError, MCPSearchToolsResponse>> => {

    return mcpToolsRequest<MCPSearchToolsResponse>( {
        method: 'searchTools'
        , params
    } );

};

export const getMcpTool = async (
    params: { id: string; version?: string }
): Promise<Either<ResourceError, MCPGetToolResponse>> => {

    return mcpToolsRequest<MCPGetToolResponse>( {
        method: 'getTool'
        , params
    } );

};

export const runMcpTool = async (
    params: { id: string; version?: string; input: Record<string, unknown> }
): Promise<Either<ResourceError, MCPRunToolResponse>> => {

    return mcpToolsRequest<MCPRunToolResponse>( {
        method: 'runTool'
        , params
    } );

};
