import { Request } from 'express';

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
