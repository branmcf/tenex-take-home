import { Response } from 'express';
import { ResourceError } from '../../errors';
import {
    GetToolsRequest
    , GetToolsResponse
    , SearchToolsRequest
    , SearchToolsResponse
    , GetToolByIdRequest
    , GetToolByIdResponse
} from './tools.types';
import {
    getCachedTools
    , searchToolsInMcp
} from './tools.helper';
import { getToolById } from './tools.service';

const mapToolResponse = ( tool: {
    id: string;
    name: string;
    description?: string | null;
    schema?: Record<string, unknown> | null;
    source: string;
    version?: string | null;
} ) => ( {
    id: tool.id
    , name: tool.name
    , description: tool.description ?? null
    , version: tool.version ?? null
    , source: tool.source === 'mcp' ? 'mcp' : 'local'
    , schema: tool.schema ?? null
} );

/**
 * @title Get Tools Handler
 * @notice Returns tools from cache, optionally refreshing from MCP.
 * @param req Express request
 * @param res Express response
 */
export const getToolsHandler = async (
    req: GetToolsRequest
    , res: Response<ResourceError | GetToolsResponse>
): Promise<Response<ResourceError | GetToolsResponse>> => {

    // check refresh flag
    const refresh = req.query.refresh === 'true';

    // get cached tools
    const toolsResult = await getCachedTools( refresh );

    if ( toolsResult.isError() ) {
        return res
            .status( toolsResult.value.statusCode )
            .json( toolsResult.value );
    }

    // map tools to response
    const tools = toolsResult.value.map( tool => ( {
        id: tool.id
        , name: tool.name
        , description: tool.description ?? null
        , version: tool.version ?? null
        , source: tool.source === 'mcp' ? 'mcp' : 'local'
    } ) );

    return res.status( 200 ).json( { tools } );

};

/**
 * @title Search Tools Handler
 * @notice Searches tools using MCP and caches results.
 * @param req Express request
 * @param res Express response
 */
export const searchToolsHandler = async (
    req: SearchToolsRequest
    , res: Response<ResourceError | SearchToolsResponse>
): Promise<Response<ResourceError | SearchToolsResponse>> => {

    const query = req.query.q;

    const searchResult = await searchToolsInMcp( query );

    if ( searchResult.isError() ) {
        return res
            .status( searchResult.value.statusCode )
            .json( searchResult.value );
    }

    const tools = searchResult.value.map( tool => ( {
        id: tool.id
        , name: tool.name
        , description: tool.description ?? null
        , version: tool.version ?? null
        , source: tool.source === 'mcp' ? 'mcp' : 'local'
    } ) );

    return res.status( 200 ).json( { tools } );

};

/**
 * @title Get Tool By Id Handler
 * @notice Returns a single tool with schema.
 * @param req Express request
 * @param res Express response
 */
export const getToolByIdHandler = async (
    req: GetToolByIdRequest
    , res: Response<ResourceError | GetToolByIdResponse>
): Promise<Response<ResourceError | GetToolByIdResponse>> => {

    const { toolId } = req.params;

    const toolResult = await getToolById( toolId );

    if ( toolResult.isError() ) {
        return res
            .status( toolResult.value.statusCode )
            .json( toolResult.value );
    }

    const tool = mapToolResponse( toolResult.value );

    return res.status( 200 ).json( { tool } );

};
