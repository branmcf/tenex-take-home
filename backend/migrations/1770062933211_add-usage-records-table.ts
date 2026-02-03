import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        -- Usage records table: tracks token usage and costs for billing/analytics
        CREATE TABLE usage_records (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
            model_id TEXT NOT NULL REFERENCES models(id),
            message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
            workflow_chat_message_id UUID REFERENCES workflow_chat_messages(id) ON DELETE SET NULL,
            context TEXT,
            input_tokens BIGINT NOT NULL DEFAULT 0 CHECK (input_tokens >= 0),
            output_tokens BIGINT NOT NULL DEFAULT 0 CHECK (output_tokens >= 0),
            estimated_cost_cents BIGINT NOT NULL DEFAULT 0 CHECK (estimated_cost_cents >= 0),
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

            -- Prevent both message references being set (at most one should be set)
            CONSTRAINT usage_records_message_check CHECK (
                NOT (message_id IS NOT NULL AND workflow_chat_message_id IS NOT NULL)
            )
        );

        -- Add comment documenting context field
        COMMENT ON COLUMN usage_records.context IS 'Describes usage when no message attached (e.g., workflow_compilation)';

        -- Indexes
        CREATE INDEX usage_records_user_id_created_at_idx ON usage_records(user_id, created_at);
        CREATE INDEX usage_records_user_id_model_id_idx ON usage_records(user_id, model_id);
    ` );
};

export const down = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        DROP INDEX IF EXISTS usage_records_user_id_model_id_idx;
        DROP INDEX IF EXISTS usage_records_user_id_created_at_idx;
        DROP TABLE IF EXISTS usage_records;
    ` );
};
