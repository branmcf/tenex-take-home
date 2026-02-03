import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        -- Step runs table: tracks execution of individual workflow steps
        CREATE TABLE step_runs (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            workflow_run_id UUID NOT NULL REFERENCES workflow_runs(id) ON DELETE CASCADE,
            step_id TEXT NOT NULL CHECK (length(step_id) > 0),
            status step_run_status NOT NULL DEFAULT 'queued',
            output TEXT,
            logs JSONB,
            tool_calls JSONB,
            error TEXT,
            started_at TIMESTAMPTZ,
            completed_at TIMESTAMPTZ,

            -- Each step can only run once per workflow run
            UNIQUE(workflow_run_id, step_id),

            -- Ensure timing fields are consistent with status
            CONSTRAINT step_runs_timing_check CHECK (
                (status = 'queued' AND started_at IS NULL AND completed_at IS NULL) OR
                (status = 'running' AND started_at IS NOT NULL AND completed_at IS NULL) OR
                (status IN ('passed', 'failed', 'cancelled') AND started_at IS NOT NULL AND completed_at IS NOT NULL)
            )
        );

        -- Indexes
        CREATE INDEX step_runs_workflow_run_id_started_at_idx
            ON step_runs(workflow_run_id, started_at);
    ` );
};

export const down = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        DROP INDEX IF EXISTS step_runs_workflow_run_id_started_at_idx;
        DROP TABLE IF EXISTS step_runs;
    ` );
};
