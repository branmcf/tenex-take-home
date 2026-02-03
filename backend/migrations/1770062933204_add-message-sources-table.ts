import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        -- Message sources table: stores source/reference links for assistant messages
        CREATE TABLE message_sources (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
            url TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            position SMALLINT NOT NULL DEFAULT 0 CHECK (position >= 0),
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

            UNIQUE(message_id, position)
        );

        -- Indexes
        CREATE INDEX message_sources_message_id_idx ON message_sources(message_id);
    ` );
};

export const down = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        DROP INDEX IF EXISTS message_sources_message_id_idx;
        DROP TABLE IF EXISTS message_sources;
    ` );
};
