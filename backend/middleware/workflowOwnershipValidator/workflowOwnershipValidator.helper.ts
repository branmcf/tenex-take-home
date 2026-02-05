import { getWorkflowOwnership } from '../../app/workflows/workflows.service';
import {
    WorkflowNotFoundError
    , WorkflowAccessDeniedError
    , WorkflowIdRequiredError
} from './workflowOwnershipValidator.errors';

/**
 * validate that a workflow exists and belongs to the specified user
 *
 * @param workflowId - the workflow id to validate
 * @param userId - the user id to check ownership against
 * @throws WorkflowIdRequiredError if workflowId is not provided
 * @throws WorkflowNotFoundError if workflow does not exist or is deleted
 * @throws WorkflowAccessDeniedError if workflow does not belong to the user
 */
export const validateWorkflowOwnership = async (
    workflowId: string | undefined
    , userId: string
): Promise<void> => {

    // check for falsy workflowId
    if ( !workflowId ) {
        throw new WorkflowIdRequiredError();
    }

    // get the workflow ownership info from the database
    const getWorkflowOwnershipResult = await getWorkflowOwnership( workflowId );

    // check for errors
    if ( getWorkflowOwnershipResult.isError() ) {

        // if workflow not found, throw specific error
        if ( getWorkflowOwnershipResult.value.code === 'WORKFLOW_NOT_FOUND' ) {
            throw new WorkflowNotFoundError();
        }

        // throw the original error for other cases
        throw getWorkflowOwnershipResult.value;
    }

    // extract the workflow data
    const workflow = getWorkflowOwnershipResult.value;

    // check if workflow data exists
    if ( !workflow ) {
        throw new WorkflowNotFoundError();
    }

    // check if workflow belongs to the user
    if ( workflow.userId !== userId ) {
        throw new WorkflowAccessDeniedError();
    }

};
