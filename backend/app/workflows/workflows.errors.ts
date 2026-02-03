import { ResourceError } from '../../errors';

export class WorkflowsNotFound extends ResourceError {
    public constructor () {
        const clientMessage = `No workflows found.`;
        const code = 'WORKFLOWS_NOT_FOUND';
        const statusCode = 404;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class GetWorkflowsFailed extends ResourceError {
    public constructor () {
        const clientMessage = `Failed to retrieve workflows.`;
        const code = 'GET_WORKFLOWS_FAILED';
        const statusCode = 500;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class WorkflowNotFound extends ResourceError {
    public constructor () {
        const clientMessage = `Workflow not found.`;
        const code = 'WORKFLOW_NOT_FOUND';
        const statusCode = 404;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class CreateWorkflowFailed extends ResourceError {
    public constructor () {
        const clientMessage = `Failed to create workflow.`;
        const code = 'CREATE_WORKFLOW_FAILED';
        const statusCode = 500;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class UpdateWorkflowFailed extends ResourceError {
    public constructor () {
        const clientMessage = `Failed to update workflow.`;
        const code = 'UPDATE_WORKFLOW_FAILED';
        const statusCode = 500;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class DeleteWorkflowFailed extends ResourceError {
    public constructor () {
        const clientMessage = `Failed to delete workflow.`;
        const code = 'DELETE_WORKFLOW_FAILED';
        const statusCode = 500;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}
