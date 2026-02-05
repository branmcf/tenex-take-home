export interface MCPTool {
    id: string;
    name: string;
    description: string | null;
    schema: Record<string, unknown>;
    version: string;
    tags?: string[];
}

export interface MCPListToolsResponse {
    tools: MCPTool[];
    nextCursor: string | null;
}

export interface MCPSearchToolsResponse {
    tools: MCPTool[];
}

export interface MCPGetToolResponse {
    tool: MCPTool;
}

export interface MCPRunToolResponse {
    output: Record<string, unknown>;
}

export interface MCPResponse<T> {
    result: T;
}

export interface MCPRequestParams<T> {
    method: 'listTools' | 'searchTools' | 'getTool' | 'runTool';
    params: T;
}
