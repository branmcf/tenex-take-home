/* eslint-disable */
import * as Types from '../../lib/postGraphile/postGraphile.generatedTypes';

export type GetUserWorkflowsQueryVariables = Types.Exact<{
  userId: Types.Scalars['String']['input'];
}>;

export type GetUserWorkflowsQuery = {
    __typename: 'Query';
    userById?: {
        __typename: 'User';
        id: string;
        workflowsByUserId: {
            __typename: 'WorkflowsConnection';
            nodes: Array<{
                __typename: 'Workflow';
                id: string;
                name: string;
                description?: string | null;
                updatedAt: string;
                workflowVersionsByWorkflowId: {
                    __typename: 'WorkflowVersionsConnection';
                    nodes: Array<{
                        __typename: 'WorkflowVersion';
                        versionNumber: number;
                    } | null>;
                };
            } | null>;
        };
    } | null;
};
