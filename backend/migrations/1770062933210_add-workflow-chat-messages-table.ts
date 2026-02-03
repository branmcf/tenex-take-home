import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        -- Workflow chat messages table: stores the editing/authoring conversation for workflows
        -- This is separate from regular messages because it belongs to a workflow, not a chat
        CREATE TABLE workflow_chat_messages (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
            role message_role NOT NULL,
            content TEXT NOT NULL CHECK (length(content) > 0),
            model_id TEXT REFERENCES models(id) ON DELETE SET NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        -- Indexes
        CREATE INDEX workflow_chat_messages_workflow_id_created_at_idx
            ON workflow_chat_messages(workflow_id, created_at);
    ` );
};

export const down = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        DROP INDEX IF EXISTS workflow_chat_messages_workflow_id_created_at_idx;
        DROP TABLE IF EXISTS workflow_chat_messages;
    ` );
};
