/* ----------------- Imports --------------------- */
import { WorkflowProposalsExpirationDatasetCase } from './datasets.types';

export const workflowProposalsExpirationDataset: WorkflowProposalsExpirationDatasetCase[] = [
    {
        name: 'marks proposal as expired when expiresAt is in the past'
        , story: 'Expired proposals should be marked and reported as expired.'
        , inputs: {
            proposalById: {
                id: 'proposal-1'
                , workflowId: 'workflow-1'
                , baseVersionId: 'version-1'
                , userMessage: 'Update'
                , modelId: 'gpt-4o'
                , toolCalls: []
                , proposedDag: { steps: [] }
                , createdAt: new Date().toISOString()
                , expiresAt: new Date( Date.now() - 1000 ).toISOString()
            }
        }
        , expected: {
            isError: true
            , code: 'WORKFLOW_PROPOSAL_EXPIRED'
            , expiredMarked: true
        }
    }
    , {
        name: 'returns the first unexpired pending proposal'
        , story: 'The system selects the most recent unexpired proposal.'
        , inputs: {
            proposals: [
                {
                    id: 'proposal-expired'
                    , workflowId: 'workflow-1'
                    , baseVersionId: 'version-1'
                    , userMessage: 'Update'
                    , modelId: 'gpt-4o'
                    , toolCalls: []
                    , proposedDag: { steps: [] }
                    , createdAt: new Date().toISOString()
                    , expiresAt: new Date( Date.now() - 1000 ).toISOString()
                    , status: 'pending'
                }
                , {
                    id: 'proposal-ok'
                    , workflowId: 'workflow-1'
                    , baseVersionId: 'version-1'
                    , userMessage: 'Update'
                    , modelId: 'gpt-4o'
                    , toolCalls: []
                    , proposedDag: { steps: [] }
                    , createdAt: new Date().toISOString()
                    , expiresAt: new Date( Date.now() + 100000 ).toISOString()
                    , status: 'pending'
                }
            ]
        }
        , expected: {
            isSuccess: true
            , proposalId: 'proposal-ok'
            , expiredMarked: true
        }
    }
];
