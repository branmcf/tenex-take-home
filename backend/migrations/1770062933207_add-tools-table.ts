import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        -- Tools table: stores system and user-defined tools available for workflow steps
        CREATE TABLE tools (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL CHECK (length(name) > 0),
            description TEXT,
            schema JSONB,
            is_system BOOLEAN NOT NULL DEFAULT false,
            user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMPTZ,

            -- Ensure system tools have no user, custom tools have a user
            CONSTRAINT tools_ownership_check CHECK (
                (is_system = true AND user_id IS NULL) OR
                (is_system = false AND user_id IS NOT NULL)
            )
        );

        -- Trigger to auto-update updated_at
        CREATE TRIGGER tools_updated_at
            BEFORE UPDATE ON tools
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        -- Indexes
        -- System tools: globally unique names
        CREATE UNIQUE INDEX tools_system_name_unique
            ON tools(name) WHERE is_system = true;
        -- User tools: unique per user (among non-deleted tools)
        CREATE UNIQUE INDEX tools_user_name_unique
            ON tools(user_id, name) WHERE is_system = false AND deleted_at IS NULL;
        CREATE INDEX tools_is_system_idx ON tools(is_system) WHERE is_system = true;
        CREATE INDEX tools_user_id_idx ON tools(user_id) WHERE user_id IS NOT NULL;
    ` );
};

export const down = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        DROP TRIGGER IF EXISTS tools_updated_at ON tools;
        DROP INDEX IF EXISTS tools_user_id_idx;
        DROP INDEX IF EXISTS tools_is_system_idx;
        DROP INDEX IF EXISTS tools_user_name_unique;
        DROP INDEX IF EXISTS tools_system_name_unique;
        DROP TABLE IF EXISTS tools;
    ` );
};
