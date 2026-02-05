import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        ALTER TABLE workflow_proposals
            ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'applied', 'rejected', 'expired')),
            ADD COLUMN resolved_at TIMESTAMPTZ;

        CREATE INDEX workflow_proposals_status_idx
            ON workflow_proposals(status);
    ` );
};

export const down = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        DROP INDEX IF EXISTS workflow_proposals_status_idx;

        ALTER TABLE workflow_proposals
            DROP COLUMN IF EXISTS resolved_at,
            DROP COLUMN IF EXISTS status;
    ` );
};
