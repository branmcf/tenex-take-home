import {
    Either
    , error
    , success
} from '../../types';
import { ResourceError } from '../../errors';
import { listMcpTools, searchMcpTools } from '../../lib/mcpToolsServer';
import { createHash } from 'crypto';
import {
    createTool
    , getToolByExternalId
    , getTools
    , updateToolById
} from './tools.service';
import {
    ToolRecord
    , ToolResponse
    , GetToolByIdResponse
} from './tools.types';

const buildSchemaHash = ( schema: Record<string, unknown> | null | undefined ) => {
    if ( !schema ) {
        return null;
    }

    const json = JSON.stringify( schema );

    // simple hash using builtin crypto
    return createHash( 'sha256' ).update( json )
        .digest( 'hex' );
};

const upsertMcpTool = async (
    tool: {
        id: string;
        name: string;
        description: string | null;
        schema: Record<string, unknown>;
        version: string;
    }
): Promise<Either<ResourceError, ToolRecord>> => {

    const existingResult = await getToolByExternalId( tool.id );

    if ( existingResult.isError() ) {
        return error( existingResult.value );
    }

    const schemaHash = buildSchemaHash( tool.schema );
    const lastSyncedAt = new Date().toISOString();

    if ( existingResult.value ) {
        return updateToolById( existingResult.value.id, {
            name: tool.name
            , description: tool.description
            , schema: tool.schema
            , source: 'mcp'
            , externalId: tool.id
            , version: tool.version
            , schemaHash
            , lastSyncedAt
        } );
    }

    return createTool( {
        name: tool.name
        , description: tool.description
        , schema: tool.schema
        , isSystem: true
        , source: 'mcp'
        , externalId: tool.id
        , version: tool.version
        , schemaHash
        , lastSyncedAt
    } );

};

/**
 * sync tools from MCP into the local cache
 *
 * @returns Either<ResourceError, ToolRecord[]>
 */
export const syncToolsFromMcp = async (): Promise<Either<ResourceError, ToolRecord[]>> => {

    const listResult = await listMcpTools( { limit: 200 } );

    if ( listResult.isError() ) {
        return error( listResult.value );
    }

    const tools: ToolRecord[] = [];

    for ( const tool of listResult.value.tools ) {
        const upsertResult = await upsertMcpTool( tool );

        if ( upsertResult.isError() ) {
            return error( upsertResult.value );
        }

        tools.push( upsertResult.value );
    }

    return success( tools );

};

/**
 * search tools in MCP and sync results into cache
 *
 * @param query - search query
 * @returns Either<ResourceError, ToolRecord[]>
 */
export const searchToolsInMcp = async (
    query: string
): Promise<Either<ResourceError, ToolRecord[]>> => {

    const searchResult = await searchMcpTools( { query, limit: 50 } );

    if ( searchResult.isError() ) {
        return error( searchResult.value );
    }

    const tools: ToolRecord[] = [];

    for ( const tool of searchResult.value.tools ) {
        const upsertResult = await upsertMcpTool( tool );

        if ( upsertResult.isError() ) {
            return error( upsertResult.value );
        }

        tools.push( upsertResult.value );
    }

    return success( tools );

};

/**
 * get cached tools, optionally syncing from MCP
 *
 * @param refresh - if true, force sync before returning
 * @returns Either<ResourceError, ToolRecord[]>
 */
export const getCachedTools = async (
    refresh: boolean
): Promise<Either<ResourceError, ToolRecord[]>> => {

    if ( refresh ) {
        const syncResult = await syncToolsFromMcp();

        if ( syncResult.isError() ) {
            return error( syncResult.value );
        }

        return success( syncResult.value );
    }

    return getTools();

};

/**
 * Map a tool record to API response format
 *
 * @param tool - tool record from database or MCP
 * @returns formatted tool response
 */
export const mapToolResponse = ( tool: {
    id: string;
    name: string;
    description?: string | null;
    source: 'mcp' | 'local';
    version?: string | null;
} ): ToolResponse => ( {
    id: tool.id
    , name: tool.name
    , description: tool.description ?? null
    , version: tool.version ?? null
    , source: tool.source === 'mcp' ? 'mcp' : 'local'
} );

/**
 * Map a tool record to API response format with schema
 *
 * @param tool - tool record from database or MCP
 * @returns formatted tool response with schema
 */
export const mapToolWithSchemaResponse = ( tool: {
    id: string;
    name: string;
    description?: string | null;
    schema?: Record<string, unknown> | null;
    source: 'mcp' | 'local';
    version?: string | null;
} ): GetToolByIdResponse['tool'] => ( {
    ...mapToolResponse( tool )
    , schema: tool.schema ?? null
} );
