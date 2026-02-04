import { ResourceError } from '../../errors';

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
