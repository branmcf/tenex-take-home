import { ResourceError } from '../../../errors';
import {
    Either
    , error
    , success
} from '../../../types';
import { WorkflowChatProposalHistoryItem } from '../workflowChatMessages.types';
import {
    buildPendingProposalResponse as trueBuildPendingProposalResponse
    , generateWorkflowChatResponse as trueGenerateWorkflowChatResponse
    , normalizeProposalStatus as trueNormalizeProposalStatus
} from '../workflowChatMessages.helper';

interface GenerateWorkflowChatResponseMock extends jest.Mock<
    ReturnType<typeof trueGenerateWorkflowChatResponse>
    , Parameters<typeof trueGenerateWorkflowChatResponse>
> {
    mockResponseOnce(
        result?: {
            content: string;
            proposedChanges?: {
                proposalId: string;
                baseVersionId: string | null;
                toolCalls: unknown;
                previewSteps: Array<{
                    id: string;
                    name: string;
                    instruction: string;
                    tools?: Array<{ id: string; name?: string; version?: string }>;
                    dependsOn?: string[];
                }>;
                status?: 'pending' | 'applied' | 'rejected' | 'expired';
                createdAt?: string;
                resolvedAt?: string | null;
            };
        }
    ): this;
    mockResponse(
        result?: {
            content: string;
            proposedChanges?: {
                proposalId: string;
                baseVersionId: string | null;
                toolCalls: unknown;
                previewSteps: Array<{
                    id: string;
                    name: string;
                    instruction: string;
                    tools?: Array<{ id: string; name?: string; version?: string }>;
                    dependsOn?: string[];
                }>;
                status?: 'pending' | 'applied' | 'rejected' | 'expired';
                createdAt?: string;
                resolvedAt?: string | null;
            };
        }
    ): this;
    mockResponseErrorOnce( error?: ResourceError ): this;
    mockResponseError( error?: ResourceError ): this;
}

const defaultGenerateResponse = { content: 'Mock workflow assistant response' };

const generateWorkflowChatResponseMock = jest.fn<
    ReturnType<typeof trueGenerateWorkflowChatResponse>
    , Parameters<typeof trueGenerateWorkflowChatResponse>
>( trueGenerateWorkflowChatResponse ) as GenerateWorkflowChatResponseMock;

generateWorkflowChatResponseMock.mockResponseOnce = (
    result = defaultGenerateResponse
) =>
    generateWorkflowChatResponseMock.mockImplementationOnce(
        async (): Promise<Either<ResourceError, typeof result>> => success( result )
    );

generateWorkflowChatResponseMock.mockResponse = (
    result = defaultGenerateResponse
) =>
    generateWorkflowChatResponseMock.mockImplementation(
        async (): Promise<Either<ResourceError, typeof result>> => success( result )
    );

generateWorkflowChatResponseMock.mockResponseErrorOnce = (
    resourceError = new ResourceError( { message: 'Workflow chat response generation failed' } )
) =>
    generateWorkflowChatResponseMock.mockImplementationOnce(
        async () => error( resourceError )
    );

generateWorkflowChatResponseMock.mockResponseError = (
    resourceError = new ResourceError( { message: 'Workflow chat response generation failed' } )
) =>
    generateWorkflowChatResponseMock.mockImplementation(
        async () => error( resourceError )
    );

type NormalizeProposalStatusMock = jest.Mock<
    ReturnType<typeof trueNormalizeProposalStatus>
    , Parameters<typeof trueNormalizeProposalStatus>
>;

const normalizeProposalStatusMock = jest.fn<
    ReturnType<typeof trueNormalizeProposalStatus>
    , Parameters<typeof trueNormalizeProposalStatus>
>( trueNormalizeProposalStatus ) as NormalizeProposalStatusMock;

interface BuildPendingProposalResponseMock extends jest.Mock<
    ReturnType<typeof trueBuildPendingProposalResponse>
    , Parameters<typeof trueBuildPendingProposalResponse>
> {
    mockResponseOnce( result?: WorkflowChatProposalHistoryItem ): this;
    mockResponse( result?: WorkflowChatProposalHistoryItem ): this;
}

const defaultProposalResponse: WorkflowChatProposalHistoryItem = {
    proposalId: 'mock-proposal-id'
    , baseVersionId: null
    , toolCalls: []
    , previewSteps: []
    , status: 'pending'
    , createdAt: new Date().toISOString()
    , resolvedAt: null
};

const buildPendingProposalResponseMock = jest.fn<
    ReturnType<typeof trueBuildPendingProposalResponse>
    , Parameters<typeof trueBuildPendingProposalResponse>
>( trueBuildPendingProposalResponse ) as BuildPendingProposalResponseMock;

buildPendingProposalResponseMock.mockResponseOnce = (
    result = defaultProposalResponse
) =>
    buildPendingProposalResponseMock.mockImplementationOnce(
        () => result
    );

buildPendingProposalResponseMock.mockResponse = (
    result = defaultProposalResponse
) =>
    buildPendingProposalResponseMock.mockImplementation(
        () => result
    );

jest.doMock( '../workflowChatMessages.helper', () => ( {
    generateWorkflowChatResponse: generateWorkflowChatResponseMock
    , normalizeProposalStatus: normalizeProposalStatusMock
    , buildPendingProposalResponse: buildPendingProposalResponseMock
} ) );

export const generateWorkflowChatResponse = generateWorkflowChatResponseMock;

export const normalizeProposalStatus = normalizeProposalStatusMock;

export const buildPendingProposalResponse = buildPendingProposalResponseMock;
