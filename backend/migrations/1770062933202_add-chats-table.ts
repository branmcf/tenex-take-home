import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        -- Chats table: stores user conversations
        CREATE TABLE chats (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
            title TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMPTZ
        );

        -- Trigger to auto-update updated_at
        CREATE TRIGGER chats_updated_at
            BEFORE UPDATE ON chats
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        -- Indexes
        CREATE INDEX chats_user_id_idx ON chats(user_id);
        CREATE INDEX chats_user_id_updated_at_idx ON chats(user_id, updated_at DESC)
            WHERE deleted_at IS NULL;
    ` );
};

export const down = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        DROP TRIGGER IF EXISTS chats_updated_at ON chats;
        DROP INDEX IF EXISTS chats_user_id_updated_at_idx;
        DROP INDEX IF EXISTS chats_user_id_idx;
        DROP TABLE IF EXISTS chats;
    ` );
};
