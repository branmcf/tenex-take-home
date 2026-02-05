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
import { Log } from '../../utils';

const getBaseUrl = () => {
    return process.env.MCP_TOOLS_URL ?? 'http://localhost:4010';
};

const normalizeServiceKey = ( value: string ) => {
    const trimmed = value.trim();
    if ( trimmed.startsWith( '"' ) && trimmed.endsWith( '"' ) ) {
        return trimmed.slice( 1, -1 );
    }
    if ( trimmed.startsWith( '\'' ) && trimmed.endsWith( '\'' ) ) {
        return trimmed.slice( 1, -1 );
    }
    return trimmed;
};

const getServiceKey = () => {
    return normalizeServiceKey( process.env.MCP_TOOLS_API_KEY ?? '' );
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
        const axiosError = err as AxiosError;
        const response = axiosError?.response;
        const responseData = response?.data;
        const errorCode = responseData && typeof responseData === 'object'
            ? ( responseData as { code?: string } ).code
            : undefined;
        const errorMessage = responseData && typeof responseData === 'object'
            ? ( responseData as { message?: string; clientMessage?: string } ).message
                ?? ( responseData as { clientMessage?: string } ).clientMessage
            : undefined;
        const statusCode = response?.status;

        const errorCodesMap = new Map<string, ResourceError>( [
            [ 'MCP_METHOD_NOT_FOUND', new MCPMethodNotFound() ]
            , [ 'MCP_TOOL_NOT_FOUND', new MCPToolNotFound() ]
            , [ 'MCP_TOOL_EXECUTION_FAILED', new MCPToolExecutionFailed() ]
        ] );

        const mappedError = errorCode ? errorCodesMap.get( errorCode ) : undefined;

        if ( mappedError ) {
            return error( mappedError );
        }

        Log.error( '[MCP] Request failed', {
            method: payload.method
            , baseUrl: getBaseUrl()
            , statusCode
            , errorCode
            , errorMessage
            , responseData
            , message: axiosError?.message
        } );

        if ( errorCode || errorMessage ) {
            return error( new ResourceError( {
                message: errorMessage ?? `MCP tools request failed (${ errorCode ?? 'UNKNOWN' }).`
                , clientMessage: errorMessage ?? `MCP tools request failed (${ errorCode ?? 'UNKNOWN' }).`
                , statusCode: statusCode ?? 500
                , code: errorCode ?? 'MCP_TOOLS_REQUEST_FAILED'
                , error: responseData
            } ) );
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
