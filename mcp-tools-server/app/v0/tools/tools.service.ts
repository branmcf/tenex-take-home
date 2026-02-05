import toolsData from '../../../data/tools.json';
import { MCPTool } from './tools.types';

const tools = toolsData as MCPTool[];

export const listTools = ( params: { cursor?: string | null; limit?: number } ) => {
    const limit = params.limit ?? 50;
    const startIndex = params.cursor ? parseInt( params.cursor, 10 ) : 0;
    const sliced = tools.slice( startIndex, startIndex + limit );
    const nextCursor = startIndex + limit < tools.length ? String( startIndex + limit ) : null;

    return {
        tools: sliced
        , nextCursor
    };
};

export const searchTools = ( params: { query: string; limit?: number } ) => {
    const query = params.query.toLowerCase();
    const limit = params.limit ?? 50;

    const results = tools.filter( tool => {
        const name = tool.name.toLowerCase();
        const description = tool.description?.toLowerCase() ?? '';
        const tags = ( tool.tags ?? [] ).join( ' ' ).toLowerCase();

        return name.includes( query ) || description.includes( query ) || tags.includes( query );
    } );

    return {
        tools: results.slice( 0, limit )
    };
};

export const getTool = ( params: { id: string; version?: string } ) => {
    const tool = tools.find( candidate => {
        if ( candidate.id !== params.id ) {
            return false;
        }

        if ( params.version && candidate.version !== params.version ) {
            return false;
        }

        return true;
    } );

    return tool ?? null;
};
