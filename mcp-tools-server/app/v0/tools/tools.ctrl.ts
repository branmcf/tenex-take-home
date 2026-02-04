import { Response } from 'express';
import { ResourceError } from '../../../errors';
import { MCPMethodNotFound } from './tools.errors';
import {
    MCPRequestBody
    , MCPResponse
    , ListToolsResult
    , SearchToolsResult
    , GetToolResult
    , RunToolResult
} from './tools.types';
import {
    listToolsHelper
    , searchToolsHelper
    , getToolHelper
    , runToolHelper
} from './tools.helper';

/**
 * @title MCP Tools Handler
 * @notice Handles MCP list/search/get tool requests.
 * @param req Express request
 * @param res Express response
 */
export const handleMcpToolsRequest = async (
    req: { body: MCPRequestBody }
    , res: Response<ResourceError | MCPResponse<ListToolsResult | SearchToolsResult | GetToolResult | RunToolResult>>
): Promise<Response<ResourceError | MCPResponse<ListToolsResult | SearchToolsResult | GetToolResult | RunToolResult>>> => {

    const { method, params } = req.body;

    if ( method === 'listTools' ) {
        const result = listToolsHelper( params as { cursor?: string | null; limit?: number } );
        if ( result.isError() ) {
            return res.status( result.value.statusCode ).json( result.value );
        }
        return res.status( 200 ).json( { result: result.value } );
    }

    if ( method === 'searchTools' ) {
        const result = searchToolsHelper( params as { query: string; limit?: number } );
        if ( result.isError() ) {
            return res.status( result.value.statusCode ).json( result.value );
        }
        return res.status( 200 ).json( { result: result.value } );
    }

    if ( method === 'getTool' ) {
        const result = getToolHelper( params as { id: string; version?: string } );
        if ( result.isError() ) {
            return res.status( result.value.statusCode ).json( result.value );
        }
        return res.status( 200 ).json( { result: result.value } );
    }

    if ( method === 'runTool' ) {
        const result = await runToolHelper( params as { id: string; version?: string; input: Record<string, unknown> } );
        if ( result.isError() ) {
            return res.status( result.value.statusCode ).json( result.value );
        }
        return res.status( 200 ).json( { result: result.value } );
    }

    const error = new MCPMethodNotFound();
    return res.status( error.statusCode ).json( error );

};
