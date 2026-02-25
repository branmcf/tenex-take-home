import { ResourceError } from '../../../errors';
import {
    Either
    , error
    , success
} from '../../../types';
import { WorkflowRunResult } from '../workflowRunner.types';
import { runWorkflow as trueRunWorkflow } from '../workflowRunner.service';

interface RunWorkflowMock extends jest.Mock<
    ReturnType<typeof trueRunWorkflow>
    , Parameters<typeof trueRunWorkflow>
> {
    mockResponseOnce( result?: WorkflowRunResult ): this;
    mockResponse( result?: WorkflowRunResult ): this;
    mockResponseErrorOnce( error?: ResourceError ): this;
    mockResponseError( error?: ResourceError ): this;
}

const defaultRunWorkflowResult: WorkflowRunResult = {
    workflowRunId: 'mock-workflow-run-id'
    , content: 'Mock workflow run output'
};

const runWorkflowMock = jest.fn<
    ReturnType<typeof trueRunWorkflow>
    , Parameters<typeof trueRunWorkflow>
>( trueRunWorkflow ) as RunWorkflowMock;

const runSuccessWithCallback = async (
    params: Parameters<typeof trueRunWorkflow>[ 0 ]
    , result: WorkflowRunResult
): Promise<Either<ResourceError, WorkflowRunResult>> => {
    params.callbacks?.onRunCreated?.( result.workflowRunId );
    return success( result );
};

runWorkflowMock.mockResponseOnce = (
    result = defaultRunWorkflowResult
) =>
    runWorkflowMock.mockImplementationOnce(
        async params => runSuccessWithCallback( params, result )
    );

runWorkflowMock.mockResponse = (
    result = defaultRunWorkflowResult
) =>
    runWorkflowMock.mockImplementation(
        async params => runSuccessWithCallback( params, result )
    );

runWorkflowMock.mockResponseErrorOnce = (
    resourceError = new ResourceError( { message: 'Workflow execution failed' } )
) =>
    runWorkflowMock.mockImplementationOnce(
        async () => error( resourceError )
    );

runWorkflowMock.mockResponseError = (
    resourceError = new ResourceError( { message: 'Workflow execution failed' } )
) =>
    runWorkflowMock.mockImplementation(
        async () => error( resourceError )
    );

jest.doMock( '../workflowRunner.service', () => ( { runWorkflow: runWorkflowMock } ) );

export const runWorkflow = runWorkflowMock;
