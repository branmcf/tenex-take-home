/* ----------------- Imports --------------------- */
import { WorkflowProposalApplyDatasetCase } from './datasets.types';

export const workflowProposalApplyDataset: WorkflowProposalApplyDatasetCase[] = [
    {
        name: 'returns expired error when proposal is expired'
        , story: 'A user tries to apply a proposal that has already expired.'
        , inputs: {
            workflowId: 'workflow-1'
            , proposalId: 'proposal-1'
        }
        , mocks: { proposalResult: { type: 'expired' } }
        , expected: {
            statusCode: 410
            , errorCode: 'WORKFLOW_PROPOSAL_EXPIRED'
        }
    }
    , {
        name: 'returns 409 when proposal base version mismatches latest version'
        , story: 'The workflow changed since the proposal was created.'
        , inputs: {
            workflowId: 'workflow-1'
            , proposalId: 'proposal-1'
        }
        , mocks: {
            proposalResult: {
                type: 'success'
                , proposal: {
                    id: 'proposal-1'
                    , workflowId: 'workflow-1'
                    , baseVersionId: 'version-old'
                    , proposedDag: { steps: [] }
                    , userMessage: 'Update'
                    , modelId: 'gpt-4o'
                }
                , latestVersionId: 'version-new'
            }
        }
        , expected: {
            statusCode: 409
            , errorCode: 'WORKFLOW_PROPOSAL_VERSION_MISMATCH'
        }
    }
];
