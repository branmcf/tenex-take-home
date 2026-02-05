import {
    Either
    , error
    , success
} from '../../../types';
import { ResourceError } from '../../../errors';
import { MCPToolNotFound, MCPToolExecutionFailed } from './tools.errors';
import { listTools, searchTools, getTool } from './tools.service';
import type {
    ListToolsParams
    , SearchToolsParams
    , GetToolParams
    , RunToolParams
    , MCPTool
} from './tools.types';
import {
    executeWebSearch
    , executeReadUrl
    , executeHttpRequest
    , executeSummarize
    , executeExtractJson
} from './tools.executors';
import { Log } from '../../../utils';

export const listToolsHelper = ( params: ListToolsParams ): Either<ResourceError, { tools: MCPTool[]; nextCursor: string | null }> => {
    return success( listTools( params ) );
};

export const searchToolsHelper = ( params: SearchToolsParams ): Either<ResourceError, { tools: MCPTool[] }> => {
    return success( searchTools( params ) );
};

export const getToolHelper = ( params: GetToolParams ): Either<ResourceError, { tool: MCPTool }> => {
    const tool = getTool( params );

    if ( !tool ) {
        return error( new MCPToolNotFound() );
    }

    return success( { tool } );
};

export const runToolHelper = async (
    params: RunToolParams
): Promise<Either<ResourceError, { output: Record<string, unknown> }>> => {

    const startedAt = Date.now();
    const tool = getTool( { id: params.id, version: params.version } );

    if ( !tool ) {
        Log.warn( '[MCP] runTool failed - tool not found', {
            toolId: params.id
            , toolVersion: params.version
        } );
        return error( new MCPToolNotFound() );
    }

    try {
        if ( tool.name === 'web_search' ) {
            const output = await executeWebSearch( params.input as { query: string; limit?: number } );
            Log.info( '[MCP] runTool success', {
                toolId: tool.id
                , toolName: tool.name
                , durationMs: Date.now() - startedAt
            } );
            return success( { output } );
        }

        if ( tool.name === 'read_url' ) {
            const output = await executeReadUrl( params.input as { url: string; maxChars?: number } );
            Log.info( '[MCP] runTool success', {
                toolId: tool.id
                , toolName: tool.name
                , durationMs: Date.now() - startedAt
            } );
            return success( { output } );
        }

        if ( tool.name === 'http_request' ) {
            const output = await executeHttpRequest( params.input as { url: string; method: string; headers?: Record<string, string>; body?: unknown; timeoutMs?: number } );
            Log.info( '[MCP] runTool success', {
                toolId: tool.id
                , toolName: tool.name
                , durationMs: Date.now() - startedAt
            } );
            return success( { output } );
        }

        if ( tool.name === 'summarize' ) {
            const output = await executeSummarize( params.input as { text: string; maxWords?: number } );
            Log.info( '[MCP] runTool success', {
                toolId: tool.id
                , toolName: tool.name
                , durationMs: Date.now() - startedAt
            } );
            return success( { output } );
        }

        if ( tool.name === 'extract_json' ) {
            const output = await executeExtractJson( params.input as { text: string; fields?: string[] } );
            Log.info( '[MCP] runTool success', {
                toolId: tool.id
                , toolName: tool.name
                , durationMs: Date.now() - startedAt
            } );
            return success( { output } );
        }

        Log.warn( '[MCP] runTool failed - unsupported tool', {
            toolId: tool.id
            , toolName: tool.name
        } );
        return error( new MCPToolExecutionFailed() );
    } catch ( err ) {
        Log.error( '[MCP] runTool failed', {
            toolId: tool.id
            , toolName: tool.name
            , durationMs: Date.now() - startedAt
            , error: err instanceof Error ? err.message : err
        } );
        return error( new MCPToolExecutionFailed() );
    }
};
