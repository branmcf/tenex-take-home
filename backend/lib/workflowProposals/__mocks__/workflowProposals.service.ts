import { ResourceError } from '../../../errors';
import { success, error } from '../../../types';
import {
    createWorkflowProposal as trueCreateWorkflowProposal
    , getWorkflowProposalById as trueGetWorkflowProposalById
    , getWorkflowProposalsByWorkflowId as trueGetWorkflowProposalsByWorkflowId
    , updateWorkflowProposalStatus as trueUpdateWorkflowProposalStatus
    , deleteWorkflowProposalById as trueDeleteWorkflowProposalById
} from '../workflowProposals.service';
import type { WorkflowProposalRecord } from '../workflowProposals.types';

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
 * createWorkflowProposal mock
 */
interface CreateWorkflowProposalMock extends jest.Mock<
    ReturnType<typeof trueCreateWorkflowProposal>
    , Parameters<typeof trueCreateWorkflowProposal>
> {
    mockResponseOnce( result?: WorkflowProposalRecord ): this;
    mockResponse( result?: WorkflowProposalRecord ): this;
    mockResponseErrorOnce( error?: ResourceError ): this;
    mockResponseError( error?: ResourceError ): this;
}

const createWorkflowProposalMock = jest.fn<
    ReturnType<typeof trueCreateWorkflowProposal>
    , Parameters<typeof trueCreateWorkflowProposal>
>( trueCreateWorkflowProposal ) as CreateWorkflowProposalMock;

createWorkflowProposalMock.mockResponseOnce = ( result = createDefaultProposal() ) =>
    createWorkflowProposalMock.mockImplementationOnce(
        async () => success( result )
    );

createWorkflowProposalMock.mockResponse = ( result = createDefaultProposal() ) =>
    createWorkflowProposalMock.mockImplementation(
        async () => success( result )
    );

createWorkflowProposalMock.mockResponseErrorOnce = (
    resourceError = new ResourceError( { message: 'Failed to create workflow proposal' } )
) =>
    createWorkflowProposalMock.mockImplementationOnce(
        async () => error( resourceError )
    );

createWorkflowProposalMock.mockResponseError = (
    resourceError = new ResourceError( { message: 'Failed to create workflow proposal' } )
) =>
    createWorkflowProposalMock.mockImplementation(
        async () => error( resourceError )
    );

/**
 * getWorkflowProposalById mock
 */
interface GetWorkflowProposalByIdMock extends jest.Mock<
    ReturnType<typeof trueGetWorkflowProposalById>
    , Parameters<typeof trueGetWorkflowProposalById>
> {
    mockResponseOnce( result?: WorkflowProposalRecord ): this;
    mockResponse( result?: WorkflowProposalRecord ): this;
    mockResponseErrorOnce( error?: ResourceError ): this;
    mockResponseError( error?: ResourceError ): this;
}

const getWorkflowProposalByIdMock = jest.fn<
    ReturnType<typeof trueGetWorkflowProposalById>
    , Parameters<typeof trueGetWorkflowProposalById>
>( trueGetWorkflowProposalById ) as GetWorkflowProposalByIdMock;

getWorkflowProposalByIdMock.mockResponseOnce = ( result = createDefaultProposal() ) =>
    getWorkflowProposalByIdMock.mockImplementationOnce(
        async () => success( result )
    );

getWorkflowProposalByIdMock.mockResponse = ( result = createDefaultProposal() ) =>
    getWorkflowProposalByIdMock.mockImplementation(
        async () => success( result )
    );

getWorkflowProposalByIdMock.mockResponseErrorOnce = (
    resourceError = new ResourceError( { message: 'Workflow proposal not found' } )
) =>
    getWorkflowProposalByIdMock.mockImplementationOnce(
        async () => error( resourceError )
    );

getWorkflowProposalByIdMock.mockResponseError = (
    resourceError = new ResourceError( { message: 'Workflow proposal not found' } )
) =>
    getWorkflowProposalByIdMock.mockImplementation(
        async () => error( resourceError )
    );

/**
 * getWorkflowProposalsByWorkflowId mock
 */
interface GetWorkflowProposalsByWorkflowIdMock extends jest.Mock<
    ReturnType<typeof trueGetWorkflowProposalsByWorkflowId>
    , Parameters<typeof trueGetWorkflowProposalsByWorkflowId>
> {
    mockResponseOnce( result?: WorkflowProposalRecord[] ): this;
    mockResponse( result?: WorkflowProposalRecord[] ): this;
    mockResponseErrorOnce( error?: ResourceError ): this;
    mockResponseError( error?: ResourceError ): this;
}

const getWorkflowProposalsByWorkflowIdMock = jest.fn<
    ReturnType<typeof trueGetWorkflowProposalsByWorkflowId>
    , Parameters<typeof trueGetWorkflowProposalsByWorkflowId>
>( trueGetWorkflowProposalsByWorkflowId ) as GetWorkflowProposalsByWorkflowIdMock;

getWorkflowProposalsByWorkflowIdMock.mockResponseOnce = ( result = [] ) =>
    getWorkflowProposalsByWorkflowIdMock.mockImplementationOnce(
        async () => success( result )
    );

getWorkflowProposalsByWorkflowIdMock.mockResponse = ( result = [] ) =>
    getWorkflowProposalsByWorkflowIdMock.mockImplementation(
        async () => success( result )
    );

getWorkflowProposalsByWorkflowIdMock.mockResponseErrorOnce = (
    resourceError = new ResourceError( { message: 'Failed to get workflow proposals' } )
) =>
    getWorkflowProposalsByWorkflowIdMock.mockImplementationOnce(
        async () => error( resourceError )
    );

getWorkflowProposalsByWorkflowIdMock.mockResponseError = (
    resourceError = new ResourceError( { message: 'Failed to get workflow proposals' } )
) =>
    getWorkflowProposalsByWorkflowIdMock.mockImplementation(
        async () => error( resourceError )
    );

/**
 * updateWorkflowProposalStatus mock
 */
interface UpdateWorkflowProposalStatusMock extends jest.Mock<
    ReturnType<typeof trueUpdateWorkflowProposalStatus>
    , Parameters<typeof trueUpdateWorkflowProposalStatus>
> {
    mockResponseOnce( result?: { id: string } ): this;
    mockResponse( result?: { id: string } ): this;
    mockResponseErrorOnce( error?: ResourceError ): this;
    mockResponseError( error?: ResourceError ): this;
}

const updateWorkflowProposalStatusMock = jest.fn<
    ReturnType<typeof trueUpdateWorkflowProposalStatus>
    , Parameters<typeof trueUpdateWorkflowProposalStatus>
>( trueUpdateWorkflowProposalStatus ) as UpdateWorkflowProposalStatusMock;

updateWorkflowProposalStatusMock.mockResponseOnce = ( result = { id: 'mock-proposal-id' } ) =>
    updateWorkflowProposalStatusMock.mockImplementationOnce(
        async () => success( result )
    );

updateWorkflowProposalStatusMock.mockResponse = ( result = { id: 'mock-proposal-id' } ) =>
    updateWorkflowProposalStatusMock.mockImplementation(
        async () => success( result )
    );

updateWorkflowProposalStatusMock.mockResponseErrorOnce = (
    resourceError = new ResourceError( { message: 'Failed to update workflow proposal status' } )
) =>
    updateWorkflowProposalStatusMock.mockImplementationOnce(
        async () => error( resourceError )
    );

updateWorkflowProposalStatusMock.mockResponseError = (
    resourceError = new ResourceError( { message: 'Failed to update workflow proposal status' } )
) =>
    updateWorkflowProposalStatusMock.mockImplementation(
        async () => error( resourceError )
    );

/**
 * deleteWorkflowProposalById mock
 */
interface DeleteWorkflowProposalByIdMock extends jest.Mock<
    ReturnType<typeof trueDeleteWorkflowProposalById>
    , Parameters<typeof trueDeleteWorkflowProposalById>
> {
    mockResponseOnce( result?: string ): this;
    mockResponse( result?: string ): this;
    mockResponseErrorOnce( error?: ResourceError ): this;
    mockResponseError( error?: ResourceError ): this;
}

const deleteWorkflowProposalByIdMock = jest.fn<
    ReturnType<typeof trueDeleteWorkflowProposalById>
    , Parameters<typeof trueDeleteWorkflowProposalById>
>( trueDeleteWorkflowProposalById ) as DeleteWorkflowProposalByIdMock;

deleteWorkflowProposalByIdMock.mockResponseOnce = ( result = 'mock-proposal-id' ) =>
    deleteWorkflowProposalByIdMock.mockImplementationOnce(
        async () => success( result )
    );

deleteWorkflowProposalByIdMock.mockResponse = ( result = 'mock-proposal-id' ) =>
    deleteWorkflowProposalByIdMock.mockImplementation(
        async () => success( result )
    );

deleteWorkflowProposalByIdMock.mockResponseErrorOnce = (
    resourceError = new ResourceError( { message: 'Failed to delete workflow proposal' } )
) =>
    deleteWorkflowProposalByIdMock.mockImplementationOnce(
        async () => error( resourceError )
    );

deleteWorkflowProposalByIdMock.mockResponseError = (
    resourceError = new ResourceError( { message: 'Failed to delete workflow proposal' } )
) =>
    deleteWorkflowProposalByIdMock.mockImplementation(
        async () => error( resourceError )
    );

jest.doMock( '../workflowProposals.service', () => ( {
    createWorkflowProposal: createWorkflowProposalMock
    , getWorkflowProposalById: getWorkflowProposalByIdMock
    , getWorkflowProposalsByWorkflowId: getWorkflowProposalsByWorkflowIdMock
    , updateWorkflowProposalStatus: updateWorkflowProposalStatusMock
    , deleteWorkflowProposalById: deleteWorkflowProposalByIdMock
} ) );

export const createWorkflowProposal = createWorkflowProposalMock;
export const getWorkflowProposalById = getWorkflowProposalByIdMock;
export const getWorkflowProposalsByWorkflowId = getWorkflowProposalsByWorkflowIdMock;
export const updateWorkflowProposalStatus = updateWorkflowProposalStatusMock;
export const deleteWorkflowProposalById = deleteWorkflowProposalByIdMock;
