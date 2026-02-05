import { ResourceError } from '../../../errors';
import { success, error } from '../../../types';
import {
    storeWorkflowProposal as trueStoreWorkflowProposal
    , getWorkflowProposal as trueGetWorkflowProposal
    , removeWorkflowProposal as trueRemoveWorkflowProposal
    , getLatestWorkflowProposalForWorkflow as trueGetLatestWorkflowProposalForWorkflow
} from '../workflowProposals.helper';
import type { WorkflowProposalRecord } from '../workflowProposals.types';
import { WorkflowProposalExpired } from '../workflowProposals.errors';

const createDefaultProposal = ( overrides: Partial<WorkflowProposalRecord> = {} ): WorkflowProposalRecord => ( {
    id: 'mock-proposal-id'
    , workflowId: 'mock-workflow-id'
    , baseVersionId: null
    , userMessage: 'Mock user message'
    , modelId: 'gpt-4o'
    , toolCalls: []
    , proposedDag: { steps: [] }
    , createdAt: new Date().toISOString()
    , expiresAt: new Date( Date.now() + 5 * 60 * 1000 ).toISOString()
    , status: 'pending'
    , resolvedAt: null
    , ...overrides
} );

/**
 * storeWorkflowProposal mock
 */
interface StoreWorkflowProposalMock extends jest.Mock<
    ReturnType<typeof trueStoreWorkflowProposal>
    , Parameters<typeof trueStoreWorkflowProposal>
> {
    mockResponseOnce( result?: WorkflowProposalRecord ): this;
    mockResponse( result?: WorkflowProposalRecord ): this;
    mockResponseErrorOnce( error?: ResourceError ): this;
    mockResponseError( error?: ResourceError ): this;
}

const storeWorkflowProposalMock = jest.fn<
    ReturnType<typeof trueStoreWorkflowProposal>
    , Parameters<typeof trueStoreWorkflowProposal>
>( trueStoreWorkflowProposal ) as StoreWorkflowProposalMock;

storeWorkflowProposalMock.mockResponseOnce = ( result = createDefaultProposal() ) =>
    storeWorkflowProposalMock.mockImplementationOnce(
        async () => success( result )
    );

storeWorkflowProposalMock.mockResponse = ( result = createDefaultProposal() ) =>
    storeWorkflowProposalMock.mockImplementation(
        async () => success( result )
    );

storeWorkflowProposalMock.mockResponseErrorOnce = (
    resourceError = new ResourceError( { message: 'Failed to store workflow proposal' } )
) =>
    storeWorkflowProposalMock.mockImplementationOnce(
        async () => error( resourceError )
    );

storeWorkflowProposalMock.mockResponseError = (
    resourceError = new ResourceError( { message: 'Failed to store workflow proposal' } )
) =>
    storeWorkflowProposalMock.mockImplementation(
        async () => error( resourceError )
    );

/**
 * getWorkflowProposal mock
 */
interface GetWorkflowProposalMock extends jest.Mock<
    ReturnType<typeof trueGetWorkflowProposal>
    , Parameters<typeof trueGetWorkflowProposal>
> {
    mockResponseOnce( result?: WorkflowProposalRecord ): this;
    mockResponse( result?: WorkflowProposalRecord ): this;
    mockResponseErrorOnce( error?: ResourceError ): this;
    mockResponseError( error?: ResourceError ): this;
    mockExpiredOnce(): this;
    mockExpired(): this;
}

const getWorkflowProposalMock = jest.fn<
    ReturnType<typeof trueGetWorkflowProposal>
    , Parameters<typeof trueGetWorkflowProposal>
>( trueGetWorkflowProposal ) as GetWorkflowProposalMock;

getWorkflowProposalMock.mockResponseOnce = ( result = createDefaultProposal() ) =>
    getWorkflowProposalMock.mockImplementationOnce(
        async () => success( result )
    );

getWorkflowProposalMock.mockResponse = ( result = createDefaultProposal() ) =>
    getWorkflowProposalMock.mockImplementation(
        async () => success( result )
    );

getWorkflowProposalMock.mockResponseErrorOnce = (
    resourceError = new ResourceError( { message: 'Workflow proposal not found' } )
) =>
    getWorkflowProposalMock.mockImplementationOnce(
        async () => error( resourceError )
    );

getWorkflowProposalMock.mockResponseError = (
    resourceError = new ResourceError( { message: 'Workflow proposal not found' } )
) =>
    getWorkflowProposalMock.mockImplementation(
        async () => error( resourceError )
    );

getWorkflowProposalMock.mockExpiredOnce = () =>
    getWorkflowProposalMock.mockImplementationOnce(
        async () => error( new WorkflowProposalExpired() )
    );

getWorkflowProposalMock.mockExpired = () =>
    getWorkflowProposalMock.mockImplementation(
        async () => error( new WorkflowProposalExpired() )
    );

/**
 * removeWorkflowProposal mock
 */
interface RemoveWorkflowProposalMock extends jest.Mock<
    ReturnType<typeof trueRemoveWorkflowProposal>
    , Parameters<typeof trueRemoveWorkflowProposal>
> {
    mockResponseOnce( result?: string ): this;
    mockResponse( result?: string ): this;
    mockResponseErrorOnce( error?: ResourceError ): this;
    mockResponseError( error?: ResourceError ): this;
}

const removeWorkflowProposalMock = jest.fn<
    ReturnType<typeof trueRemoveWorkflowProposal>
    , Parameters<typeof trueRemoveWorkflowProposal>
>( trueRemoveWorkflowProposal ) as RemoveWorkflowProposalMock;

removeWorkflowProposalMock.mockResponseOnce = ( result = 'mock-proposal-id' ) =>
    removeWorkflowProposalMock.mockImplementationOnce(
        async () => success( result )
    );

removeWorkflowProposalMock.mockResponse = ( result = 'mock-proposal-id' ) =>
    removeWorkflowProposalMock.mockImplementation(
        async () => success( result )
    );

removeWorkflowProposalMock.mockResponseErrorOnce = (
    resourceError = new ResourceError( { message: 'Failed to remove workflow proposal' } )
) =>
    removeWorkflowProposalMock.mockImplementationOnce(
        async () => error( resourceError )
    );

removeWorkflowProposalMock.mockResponseError = (
    resourceError = new ResourceError( { message: 'Failed to remove workflow proposal' } )
) =>
    removeWorkflowProposalMock.mockImplementation(
        async () => error( resourceError )
    );

/**
 * getLatestWorkflowProposalForWorkflow mock
 */
interface GetLatestWorkflowProposalForWorkflowMock extends jest.Mock<
    ReturnType<typeof trueGetLatestWorkflowProposalForWorkflow>
    , Parameters<typeof trueGetLatestWorkflowProposalForWorkflow>
> {
    mockResponseOnce( result?: WorkflowProposalRecord | null ): this;
    mockResponse( result?: WorkflowProposalRecord | null ): this;
    mockResponseErrorOnce( error?: ResourceError ): this;
    mockResponseError( error?: ResourceError ): this;
    mockNoneFoundOnce(): this;
    mockNoneFound(): this;
}

const getLatestWorkflowProposalForWorkflowMock = jest.fn<
    ReturnType<typeof trueGetLatestWorkflowProposalForWorkflow>
    , Parameters<typeof trueGetLatestWorkflowProposalForWorkflow>
>( trueGetLatestWorkflowProposalForWorkflow ) as GetLatestWorkflowProposalForWorkflowMock;

getLatestWorkflowProposalForWorkflowMock.mockResponseOnce = ( result = createDefaultProposal() ) =>
    getLatestWorkflowProposalForWorkflowMock.mockImplementationOnce(
        async () => success( result )
    );

getLatestWorkflowProposalForWorkflowMock.mockResponse = ( result = createDefaultProposal() ) =>
    getLatestWorkflowProposalForWorkflowMock.mockImplementation(
        async () => success( result )
    );

getLatestWorkflowProposalForWorkflowMock.mockResponseErrorOnce = (
    resourceError = new ResourceError( { message: 'Failed to get latest workflow proposal' } )
) =>
    getLatestWorkflowProposalForWorkflowMock.mockImplementationOnce(
        async () => error( resourceError )
    );

getLatestWorkflowProposalForWorkflowMock.mockResponseError = (
    resourceError = new ResourceError( { message: 'Failed to get latest workflow proposal' } )
) =>
    getLatestWorkflowProposalForWorkflowMock.mockImplementation(
        async () => error( resourceError )
    );

getLatestWorkflowProposalForWorkflowMock.mockNoneFoundOnce = () =>
    getLatestWorkflowProposalForWorkflowMock.mockImplementationOnce(
        async () => success( null )
    );

getLatestWorkflowProposalForWorkflowMock.mockNoneFound = () =>
    getLatestWorkflowProposalForWorkflowMock.mockImplementation(
        async () => success( null )
    );

jest.doMock( '../workflowProposals.helper', () => ( {
    storeWorkflowProposal: storeWorkflowProposalMock
    , getWorkflowProposal: getWorkflowProposalMock
    , removeWorkflowProposal: removeWorkflowProposalMock
    , getLatestWorkflowProposalForWorkflow: getLatestWorkflowProposalForWorkflowMock
} ) );

export const storeWorkflowProposal = storeWorkflowProposalMock;
export const getWorkflowProposal = getWorkflowProposalMock;
export const removeWorkflowProposal = removeWorkflowProposalMock;
export const getLatestWorkflowProposalForWorkflow = getLatestWorkflowProposalForWorkflowMock;

/**
 * Helper to create mock proposals for testing
 */
export { createDefaultProposal };
