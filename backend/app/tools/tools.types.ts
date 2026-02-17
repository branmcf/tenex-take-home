import { Request } from 'express';

/**
 * Internal tool record type used for database and service layer
 */
export interface ToolRecord {
    id: string;
    name: string;
    description?: string | null;
    schema?: Record<string, unknown> | null;
    source: 'mcp' | 'local';
    externalId?: string | null;
    version?: string | null;
    schemaHash?: string | null;
    lastSyncedAt?: string | null;
}

/**
 * API response tool type
 */
export interface ToolResponse {
    id: string;
    name: string;
    description: string | null;
    version: string | null;
    source: 'mcp' | 'local';
}

export interface GetToolsRequest extends Request {
    query: {
        refresh?: string;
    };
}

export interface GetToolsResponse {
    tools: ToolResponse[];
}

export interface SearchToolsRequest extends Request {
    query: {
        q: string;
    };
}

export interface SearchToolsResponse {
    tools: ToolResponse[];
}

export interface GetToolByIdRequest extends Request {
    params: {
        toolId: string;
    };
}

export interface GetToolByIdResponse {
    tool: ToolResponse & { schema: Record<string, unknown> | null };
}
