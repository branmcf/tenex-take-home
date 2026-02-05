/**
 * Helper functions for tests
 */

/**
 * Get header tuple for service authentication
 *
 * @returns Tuple of [header name, header value] to use with supertest .set()
 */
export const getServiceAuthHeader = (): [ string, string ] => {
    const serviceKey = process.env.MCP_TOOLS_API_KEY ?? 'test-api-key';
    return [ 'x-service-key', serviceKey ];
};

/**
 * Build a valid MCP request body
 *
 * @param method - The MCP method to call
 * @param params - The parameters for the method
 * @returns MCP request body
 */
export const buildMcpRequest = (
    method: 'listTools' | 'searchTools' | 'getTool' | 'runTool'
    , params: Record<string, unknown> = {}
): { method: string; params: Record<string, unknown> } => ( {
    method
    , params
} );
