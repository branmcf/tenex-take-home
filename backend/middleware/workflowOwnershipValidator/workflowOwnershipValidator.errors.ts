import { ResourceError } from '../../errors';

export class WorkflowNotFoundError extends ResourceError {
    public constructor () {
        const clientMessage = 'Workflow with the given id not found.';
        const code = 'WORKFLOW_NOT_FOUND';
        const statusCode = 404;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class WorkflowAccessDeniedError extends ResourceError {
    public constructor () {
        const clientMessage = 'Access denied to the specified workflow.';
        const code = 'WORKFLOW_ACCESS_DENIED';
        const statusCode = 403;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class WorkflowIdRequiredError extends ResourceError {
    public constructor () {
        const clientMessage = 'Workflow ID is required.';
        const code = 'WORKFLOW_ID_REQUIRED';
        const statusCode = 400;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}
