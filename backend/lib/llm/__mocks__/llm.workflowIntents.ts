import { ResourceError } from '../../../errors';
import { success, error } from '../../../types';
import {
    generateWorkflowIntent as trueGenerateWorkflowIntent
    , generateWorkflowToolCalls as trueGenerateWorkflowToolCalls
    , generateWorkflowStepToolUsage as trueGenerateWorkflowStepToolUsage
    , generateWorkflowStepPlan as trueGenerateWorkflowStepPlan
} from '../llm.workflowIntents';
import type { LLMToolCall } from '../../../utils/workflowDags';
import type {
    WorkflowIntentResult
    , WorkflowToolUsageDecision
    , WorkflowStepPlan
} from '../llm.types';

/**
 * generateWorkflowIntent mock
 */
interface GenerateWorkflowIntentMock extends jest.Mock<
    ReturnType<typeof trueGenerateWorkflowIntent>
    , Parameters<typeof trueGenerateWorkflowIntent>
> {
    mockResponseOnce( result?: WorkflowIntentResult ): this;
    mockResponse( result?: WorkflowIntentResult ): this;
    mockResponseErrorOnce( error?: ResourceError ): this;
    mockResponseError( error?: ResourceError ): this;
}

const generateWorkflowIntentMock = jest.fn<
    ReturnType<typeof trueGenerateWorkflowIntent>
    , Parameters<typeof trueGenerateWorkflowIntent>
>( trueGenerateWorkflowIntent ) as GenerateWorkflowIntentMock;

const defaultIntentResult: WorkflowIntentResult = {
    intent: 'answer_only'
    , assistantMessage: 'Mock assistant message'
    , clarificationQuestion: null
};

generateWorkflowIntentMock.mockResponseOnce = ( result = defaultIntentResult ) =>
    generateWorkflowIntentMock.mockImplementationOnce(
        async () => success( result )
    );

generateWorkflowIntentMock.mockResponse = ( result = defaultIntentResult ) =>
    generateWorkflowIntentMock.mockImplementation(
        async () => success( result )
    );

generateWorkflowIntentMock.mockResponseErrorOnce = (
    resourceError = new ResourceError( { message: 'Workflow intent failed' } )
) =>
    generateWorkflowIntentMock.mockImplementationOnce(
        async () => error( resourceError )
    );

generateWorkflowIntentMock.mockResponseError = (
    resourceError = new ResourceError( { message: 'Workflow intent failed' } )
) =>
    generateWorkflowIntentMock.mockImplementation(
        async () => error( resourceError )
    );

/**
 * generateWorkflowToolCalls mock
 */
interface GenerateWorkflowToolCallsMock extends jest.Mock<
    ReturnType<typeof trueGenerateWorkflowToolCalls>
    , Parameters<typeof trueGenerateWorkflowToolCalls>
> {
    mockResponseOnce( result?: { assistantMessage: string; toolCalls: LLMToolCall[] } ): this;
    mockResponse( result?: { assistantMessage: string; toolCalls: LLMToolCall[] } ): this;
    mockResponseErrorOnce( error?: ResourceError ): this;
    mockResponseError( error?: ResourceError ): this;
}

const generateWorkflowToolCallsMock = jest.fn<
    ReturnType<typeof trueGenerateWorkflowToolCalls>
    , Parameters<typeof trueGenerateWorkflowToolCalls>
>( trueGenerateWorkflowToolCalls ) as GenerateWorkflowToolCallsMock;

const defaultToolCallsResult = {
    assistantMessage: 'Mock tool calls message'
    , toolCalls: [] as LLMToolCall[]
};

generateWorkflowToolCallsMock.mockResponseOnce = ( result = defaultToolCallsResult ) =>
    generateWorkflowToolCallsMock.mockImplementationOnce(
        async () => success( result )
    );

generateWorkflowToolCallsMock.mockResponse = ( result = defaultToolCallsResult ) =>
    generateWorkflowToolCallsMock.mockImplementation(
        async () => success( result )
    );

generateWorkflowToolCallsMock.mockResponseErrorOnce = (
    resourceError = new ResourceError( { message: 'Workflow tool calls failed' } )
) =>
    generateWorkflowToolCallsMock.mockImplementationOnce(
        async () => error( resourceError )
    );

generateWorkflowToolCallsMock.mockResponseError = (
    resourceError = new ResourceError( { message: 'Workflow tool calls failed' } )
) =>
    generateWorkflowToolCallsMock.mockImplementation(
        async () => error( resourceError )
    );

/**
 * generateWorkflowStepToolUsage mock
 */
interface GenerateWorkflowStepToolUsageMock extends jest.Mock<
    ReturnType<typeof trueGenerateWorkflowStepToolUsage>
    , Parameters<typeof trueGenerateWorkflowStepToolUsage>
> {
    mockResponseOnce( result?: { steps: WorkflowToolUsageDecision[] } ): this;
    mockResponse( result?: { steps: WorkflowToolUsageDecision[] } ): this;
    mockResponseErrorOnce( error?: ResourceError ): this;
    mockResponseError( error?: ResourceError ): this;
}

const generateWorkflowStepToolUsageMock = jest.fn<
    ReturnType<typeof trueGenerateWorkflowStepToolUsage>
    , Parameters<typeof trueGenerateWorkflowStepToolUsage>
>( trueGenerateWorkflowStepToolUsage ) as GenerateWorkflowStepToolUsageMock;

const defaultToolUsageResult = { steps: [] as WorkflowToolUsageDecision[] };

generateWorkflowStepToolUsageMock.mockResponseOnce = ( result = defaultToolUsageResult ) =>
    generateWorkflowStepToolUsageMock.mockImplementationOnce(
        async () => success( result )
    );

generateWorkflowStepToolUsageMock.mockResponse = ( result = defaultToolUsageResult ) =>
    generateWorkflowStepToolUsageMock.mockImplementation(
        async () => success( result )
    );

generateWorkflowStepToolUsageMock.mockResponseErrorOnce = (
    resourceError = new ResourceError( { message: 'Workflow step tool usage failed' } )
) =>
    generateWorkflowStepToolUsageMock.mockImplementationOnce(
        async () => error( resourceError )
    );

generateWorkflowStepToolUsageMock.mockResponseError = (
    resourceError = new ResourceError( { message: 'Workflow step tool usage failed' } )
) =>
    generateWorkflowStepToolUsageMock.mockImplementation(
        async () => error( resourceError )
    );

/**
 * generateWorkflowStepPlan mock
 */
interface GenerateWorkflowStepPlanMock extends jest.Mock<
    ReturnType<typeof trueGenerateWorkflowStepPlan>
    , Parameters<typeof trueGenerateWorkflowStepPlan>
> {
    mockResponseOnce( result?: { steps: WorkflowStepPlan[] } ): this;
    mockResponse( result?: { steps: WorkflowStepPlan[] } ): this;
    mockResponseErrorOnce( error?: ResourceError ): this;
    mockResponseError( error?: ResourceError ): this;
}

const generateWorkflowStepPlanMock = jest.fn<
    ReturnType<typeof trueGenerateWorkflowStepPlan>
    , Parameters<typeof trueGenerateWorkflowStepPlan>
>( trueGenerateWorkflowStepPlan ) as GenerateWorkflowStepPlanMock;

const defaultStepPlanResult = { steps: [] as WorkflowStepPlan[] };

generateWorkflowStepPlanMock.mockResponseOnce = ( result = defaultStepPlanResult ) =>
    generateWorkflowStepPlanMock.mockImplementationOnce(
        async () => success( result )
    );

generateWorkflowStepPlanMock.mockResponse = ( result = defaultStepPlanResult ) =>
    generateWorkflowStepPlanMock.mockImplementation(
        async () => success( result )
    );

generateWorkflowStepPlanMock.mockResponseErrorOnce = (
    resourceError = new ResourceError( { message: 'Workflow step plan failed' } )
) =>
    generateWorkflowStepPlanMock.mockImplementationOnce(
        async () => error( resourceError )
    );

generateWorkflowStepPlanMock.mockResponseError = (
    resourceError = new ResourceError( { message: 'Workflow step plan failed' } )
) =>
    generateWorkflowStepPlanMock.mockImplementation(
        async () => error( resourceError )
    );

jest.doMock( '../llm.workflowIntents', () => ( {
    generateWorkflowIntent: generateWorkflowIntentMock
    , generateWorkflowToolCalls: generateWorkflowToolCallsMock
    , generateWorkflowStepToolUsage: generateWorkflowStepToolUsageMock
    , generateWorkflowStepPlan: generateWorkflowStepPlanMock
} ) );

export const generateWorkflowIntent = generateWorkflowIntentMock;

export const generateWorkflowToolCalls = generateWorkflowToolCallsMock;

export const generateWorkflowStepToolUsage = generateWorkflowStepToolUsageMock;

export const generateWorkflowStepPlan = generateWorkflowStepPlanMock;
