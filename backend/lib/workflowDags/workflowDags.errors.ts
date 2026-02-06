import { ResourceError } from '../../errors';

// error thrown when dag validation fails
export class WorkflowDagValidationFailed extends ResourceError {
    public constructor ( message?: string ) {
        super( {
            message: message ?? 'Workflow DAG validation failed.'
            , clientMessage: message ?? 'Workflow DAG validation failed.'
            , statusCode: 400
            , code: 'WORKFLOW_DAG_VALIDATION_FAILED'
        } );
    }
}

// error thrown when applying dag modifications fails
export class WorkflowDagModificationFailed extends ResourceError {
    public constructor ( message?: string ) {
        super( {
            message: message ?? 'Failed to modify workflow DAG.'
            , clientMessage: message ?? 'Failed to modify workflow DAG.'
            , statusCode: 400
            , code: 'WORKFLOW_DAG_MODIFICATION_FAILED'
        } );
    }
}
