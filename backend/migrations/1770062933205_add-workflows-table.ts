import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        -- Workflows table: stores user-defined workflow definitions
        CREATE TABLE workflows (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
            name TEXT NOT NULL CHECK (length(name) > 0),
            description TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMPTZ
        );

        -- Trigger to auto-update updated_at
        CREATE TRIGGER workflows_updated_at
            BEFORE UPDATE ON workflows
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        -- Indexes
        CREATE INDEX workflows_user_id_idx ON workflows(user_id);
        CREATE INDEX workflows_user_id_updated_at_idx ON workflows(user_id, updated_at DESC)
            WHERE deleted_at IS NULL;
    ` );
};

export const down = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        DROP TRIGGER IF EXISTS workflows_updated_at ON workflows;
        DROP INDEX IF EXISTS workflows_user_id_updated_at_idx;
        DROP INDEX IF EXISTS workflows_user_id_idx;
        DROP TABLE IF EXISTS workflows;
    ` );
};
