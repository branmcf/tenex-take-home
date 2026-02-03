import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        -- Workflow runs table: tracks execution of workflows
        CREATE TABLE workflow_runs (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            workflow_version_id UUID NOT NULL REFERENCES workflow_versions(id) ON DELETE CASCADE,
            chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
            trigger_message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
            status workflow_run_status NOT NULL DEFAULT 'running',
            started_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMPTZ,

            -- Ensure completed_at is set for terminal states
            CONSTRAINT workflow_runs_status_completion_check CHECK (
                (status = 'running' AND completed_at IS NULL) OR
                (status IN ('passed', 'failed', 'cancelled') AND completed_at IS NOT NULL)
            )
        );

        -- Indexes
        CREATE INDEX workflow_runs_workflow_version_id_idx ON workflow_runs(workflow_version_id);
        CREATE INDEX workflow_runs_chat_id_idx ON workflow_runs(chat_id);
    ` );
};

export const down = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        DROP INDEX IF EXISTS workflow_runs_chat_id_idx;
        DROP INDEX IF EXISTS workflow_runs_workflow_version_id_idx;
        DROP TABLE IF EXISTS workflow_runs;
    ` );
};
