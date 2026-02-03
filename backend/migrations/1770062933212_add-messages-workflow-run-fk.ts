import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        -- Add foreign key from messages.workflow_run_id to workflow_runs
        -- This FK was deferred because workflow_runs table didn't exist when messages was created
        ALTER TABLE messages
            ADD CONSTRAINT messages_workflow_run_id_fkey
            FOREIGN KEY (workflow_run_id) REFERENCES workflow_runs(id) ON DELETE SET NULL;
    ` );
};

export const down = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_workflow_run_id_fkey;
    ` );
};
