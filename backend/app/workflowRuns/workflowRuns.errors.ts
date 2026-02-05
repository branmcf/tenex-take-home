import { ResourceError } from '../../errors';

export class WorkflowRunNotFound extends ResourceError {
    public constructor () {
        const clientMessage = 'Workflow run not found.';
        const code = 'WORKFLOW_RUN_NOT_FOUND';
        const statusCode = 404;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class WorkflowRunAccessForbidden extends ResourceError {
    public constructor () {
        const clientMessage = 'You do not have access to this workflow run.';
        const code = 'WORKFLOW_RUN_ACCESS_FORBIDDEN';
        const statusCode = 403;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}

export class WorkflowRunStreamFailed extends ResourceError {
    public constructor () {
        const clientMessage = 'Failed to stream workflow run.';
        const code = 'WORKFLOW_RUN_STREAM_FAILED';
        const statusCode = 500;
        super( {
            clientMessage
            , statusCode
            , code
        } );
    }
}
