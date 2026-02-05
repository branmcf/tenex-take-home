import { ResourceError } from '../../../errors';
import { success, error } from '../../../types';
import {
    listMcpTools as trueListMcpTools
    , searchMcpTools as trueSearchMcpTools
    , getMcpTool as trueGetMcpTool
    , runMcpTool as trueRunMcpTool
} from '../mcpToolsServer.request';
import type {
    MCPGetToolResponse
    , MCPListToolsResponse
    , MCPSearchToolsResponse
    , MCPRunToolResponse
    , MCPTool
} from '../mcpToolsServer.types';
import {
    MCPToolNotFound
    , MCPToolExecutionFailed
    , MCPToolsRequestFailed
} from '../mcpToolsServer.errors';

const createDefaultTool = ( overrides: Partial<MCPTool> = {} ): MCPTool => ( {
    id: 'tool_mock'
    , name: 'Mock Tool'
    , description: 'A mock tool for testing'
    , schema: { type: 'object', properties: {}, additionalProperties: false }
    , version: '1.0.0'
    , tags: [ 'mock' ]
    , ...overrides
} );

/**
 * listMcpTools mock
 */
interface ListMcpToolsMock extends jest.Mock<
    ReturnType<typeof trueListMcpTools>
    , Parameters<typeof trueListMcpTools>
> {
    mockResponseOnce( result?: MCPListToolsResponse ): this;
    mockResponse( result?: MCPListToolsResponse ): this;
    mockResponseErrorOnce( error?: ResourceError ): this;
    mockResponseError( error?: ResourceError ): this;
}

const listMcpToolsMock = jest.fn<
    ReturnType<typeof trueListMcpTools>
    , Parameters<typeof trueListMcpTools>
>( trueListMcpTools ) as ListMcpToolsMock;

listMcpToolsMock.mockResponseOnce = ( result = { tools: [], nextCursor: null } ) =>
    listMcpToolsMock.mockImplementationOnce(
        async () => success( result )
    );

listMcpToolsMock.mockResponse = ( result = { tools: [], nextCursor: null } ) =>
    listMcpToolsMock.mockImplementation(
        async () => success( result )
    );

listMcpToolsMock.mockResponseErrorOnce = (
    resourceError = new MCPToolsRequestFailed()
) =>
    listMcpToolsMock.mockImplementationOnce(
        async () => error( resourceError )
    );

listMcpToolsMock.mockResponseError = (
    resourceError = new MCPToolsRequestFailed()
) =>
    listMcpToolsMock.mockImplementation(
        async () => error( resourceError )
    );

/**
 * searchMcpTools mock
 */
interface SearchMcpToolsMock extends jest.Mock<
    ReturnType<typeof trueSearchMcpTools>
    , Parameters<typeof trueSearchMcpTools>
> {
    mockResponseOnce( result?: MCPSearchToolsResponse ): this;
    mockResponse( result?: MCPSearchToolsResponse ): this;
    mockResponseErrorOnce( error?: ResourceError ): this;
    mockResponseError( error?: ResourceError ): this;
}

const searchMcpToolsMock = jest.fn<
    ReturnType<typeof trueSearchMcpTools>
    , Parameters<typeof trueSearchMcpTools>
>( trueSearchMcpTools ) as SearchMcpToolsMock;

searchMcpToolsMock.mockResponseOnce = ( result = { tools: [] } ) =>
    searchMcpToolsMock.mockImplementationOnce(
        async () => success( result )
    );

searchMcpToolsMock.mockResponse = ( result = { tools: [] } ) =>
    searchMcpToolsMock.mockImplementation(
        async () => success( result )
    );

searchMcpToolsMock.mockResponseErrorOnce = (
    resourceError = new MCPToolsRequestFailed()
) =>
    searchMcpToolsMock.mockImplementationOnce(
        async () => error( resourceError )
    );

searchMcpToolsMock.mockResponseError = (
    resourceError = new MCPToolsRequestFailed()
) =>
    searchMcpToolsMock.mockImplementation(
        async () => error( resourceError )
    );

/**
 * getMcpTool mock
 */
interface GetMcpToolMock extends jest.Mock<
    ReturnType<typeof trueGetMcpTool>
    , Parameters<typeof trueGetMcpTool>
> {
    mockResponseOnce( result?: MCPGetToolResponse ): this;
    mockResponse( result?: MCPGetToolResponse ): this;
    mockResponseErrorOnce( error?: ResourceError ): this;
    mockResponseError( error?: ResourceError ): this;
}

const getMcpToolMock = jest.fn<
    ReturnType<typeof trueGetMcpTool>
    , Parameters<typeof trueGetMcpTool>
>( trueGetMcpTool ) as GetMcpToolMock;

getMcpToolMock.mockResponseOnce = ( result = { tool: createDefaultTool() } ) =>
    getMcpToolMock.mockImplementationOnce(
        async () => success( result )
    );

getMcpToolMock.mockResponse = ( result = { tool: createDefaultTool() } ) =>
    getMcpToolMock.mockImplementation(
        async () => success( result )
    );

getMcpToolMock.mockResponseErrorOnce = (
    resourceError = new MCPToolNotFound()
) =>
    getMcpToolMock.mockImplementationOnce(
        async () => error( resourceError )
    );

getMcpToolMock.mockResponseError = (
    resourceError = new MCPToolNotFound()
) =>
    getMcpToolMock.mockImplementation(
        async () => error( resourceError )
    );

/**
 * runMcpTool mock
 */
interface RunMcpToolMock extends jest.Mock<
    ReturnType<typeof trueRunMcpTool>
    , Parameters<typeof trueRunMcpTool>
> {
    mockResponseOnce( result?: MCPRunToolResponse ): this;
    mockResponse( result?: MCPRunToolResponse ): this;
    mockResponseErrorOnce( error?: ResourceError ): this;
    mockResponseError( error?: ResourceError ): this;
}

const runMcpToolMock = jest.fn<
    ReturnType<typeof trueRunMcpTool>
    , Parameters<typeof trueRunMcpTool>
>( trueRunMcpTool ) as RunMcpToolMock;

const defaultRunToolResponse: MCPRunToolResponse = {
    output: { result: 'Mock tool output' }
};

runMcpToolMock.mockResponseOnce = ( result = defaultRunToolResponse ) =>
    runMcpToolMock.mockImplementationOnce(
        async () => success( result )
    );

runMcpToolMock.mockResponse = ( result = defaultRunToolResponse ) =>
    runMcpToolMock.mockImplementation(
        async () => success( result )
    );

runMcpToolMock.mockResponseErrorOnce = (
    resourceError = new MCPToolExecutionFailed()
) =>
    runMcpToolMock.mockImplementationOnce(
        async () => error( resourceError )
    );

runMcpToolMock.mockResponseError = (
    resourceError = new MCPToolExecutionFailed()
) =>
    runMcpToolMock.mockImplementation(
        async () => error( resourceError )
    );

jest.doMock( '../mcpToolsServer.request', () => ( {
    listMcpTools: listMcpToolsMock
    , searchMcpTools: searchMcpToolsMock
    , getMcpTool: getMcpToolMock
    , runMcpTool: runMcpToolMock
} ) );

export const listMcpTools = listMcpToolsMock;
export const searchMcpTools = searchMcpToolsMock;
export const getMcpTool = getMcpToolMock;
export const runMcpTool = runMcpToolMock;

/**
 * Helper to create mock tools for testing
 */
export { createDefaultTool };
