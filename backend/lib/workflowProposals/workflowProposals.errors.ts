import { ResourceError } from '../../errors';

export class WorkflowProposalNotFound extends ResourceError {
    public constructor () {
        super( {
            message: 'Workflow proposal not found.'
            , clientMessage: 'Workflow proposal not found.'
            , statusCode: 404
            , code: 'WORKFLOW_PROPOSAL_NOT_FOUND'
        } );
    }
}

export class WorkflowProposalExpired extends ResourceError {
    public constructor () {
        super( {
            message: 'Workflow proposal has expired.'
            , clientMessage: 'Workflow proposal has expired.'
            , statusCode: 410
            , code: 'WORKFLOW_PROPOSAL_EXPIRED'
        } );
    }
}

export class CreateWorkflowProposalFailed extends ResourceError {
    public constructor () {
        super( {
            message: 'Failed to create workflow proposal.'
            , clientMessage: 'Failed to create workflow proposal.'
            , statusCode: 500
            , code: 'WORKFLOW_PROPOSAL_CREATE_FAILED'
        } );
    }
}

export class DeleteWorkflowProposalFailed extends ResourceError {
    public constructor () {
        super( {
            message: 'Failed to delete workflow proposal.'
            , clientMessage: 'Failed to delete workflow proposal.'
            , statusCode: 500
            , code: 'WORKFLOW_PROPOSAL_DELETE_FAILED'
        } );
    }
}

export class UpdateWorkflowProposalFailed extends ResourceError {
    public constructor () {
        super( {
            message: 'Failed to update workflow proposal.'
            , clientMessage: 'Failed to update workflow proposal.'
            , statusCode: 500
            , code: 'WORKFLOW_PROPOSAL_UPDATE_FAILED'
        } );
    }
}
