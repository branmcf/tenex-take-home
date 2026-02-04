export interface MCPTool {
    id: string;
    name: string;
    description: string | null;
    schema: Record<string, unknown>;
    version: string;
    tags?: string[];
}

export interface ListToolsParams {
    cursor?: string | null;
    limit?: number;
}

export interface SearchToolsParams {
    query: string;
    limit?: number;
}

export interface GetToolParams {
    id: string;
    version?: string;
}

export interface RunToolParams {
    id: string;
    version?: string;
    input: Record<string, unknown>;
}

export interface MCPRequestBody {
    method: 'listTools' | 'searchTools' | 'getTool' | 'runTool';
    params: ListToolsParams | SearchToolsParams | GetToolParams | RunToolParams;
}

export interface MCPResponse<T> {
    result: T;
}

export interface ListToolsResult {
    tools: MCPTool[];
    nextCursor: string | null;
}

export interface SearchToolsResult {
    tools: MCPTool[];
}

export interface GetToolResult {
    tool: MCPTool;
}

export interface RunToolResult {
    output: Record<string, unknown>;
}
