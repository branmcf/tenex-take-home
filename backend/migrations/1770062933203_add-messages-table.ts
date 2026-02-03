import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        -- Messages table: stores individual messages within chats
        -- Note: workflow_run_id FK will be added in a later migration after workflow_runs table exists
        CREATE TABLE messages (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
            role message_role NOT NULL,
            content TEXT NOT NULL CHECK (length(content) > 0),
            model_id TEXT REFERENCES models(id) ON DELETE SET NULL,
            workflow_run_id UUID,
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        -- Indexes
        CREATE INDEX messages_chat_id_created_at_idx ON messages(chat_id, created_at);
        CREATE INDEX messages_content_search_idx ON messages USING gin(to_tsvector('english', content));
    ` );
};

export const down = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        DROP INDEX IF EXISTS messages_content_search_idx;
        DROP INDEX IF EXISTS messages_chat_id_created_at_idx;
        DROP TABLE IF EXISTS messages;
    ` );
};
