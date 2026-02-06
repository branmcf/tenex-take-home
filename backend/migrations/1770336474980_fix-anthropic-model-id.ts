import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        -- Insert new model row with corrected ID
        INSERT INTO models (id, name, provider, input_price_per_million, output_price_per_million, is_active, created_at, updated_at)
        SELECT 'claude-opus-4-5', name, provider, input_price_per_million, output_price_per_million, is_active, created_at, updated_at
        FROM models WHERE id = 'claude-opus-4.5';

        -- Update FK references in child tables to new ID
        UPDATE messages SET model_id = 'claude-opus-4-5' WHERE model_id = 'claude-opus-4.5';
        UPDATE usage_records SET model_id = 'claude-opus-4-5' WHERE model_id = 'claude-opus-4.5';
        UPDATE user_model_preferences SET model_id = 'claude-opus-4-5' WHERE model_id = 'claude-opus-4.5';
        UPDATE workflow_chat_messages SET model_id = 'claude-opus-4-5' WHERE model_id = 'claude-opus-4.5';

        -- Delete old model row
        DELETE FROM models WHERE id = 'claude-opus-4.5';
    ` );
};

export const down = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        -- Insert old model row with original ID
        INSERT INTO models (id, name, provider, input_price_per_million, output_price_per_million, is_active, created_at, updated_at)
        SELECT 'claude-opus-4.5', name, provider, input_price_per_million, output_price_per_million, is_active, created_at, updated_at
        FROM models WHERE id = 'claude-opus-4-5';

        -- Revert FK references in child tables to old ID
        UPDATE messages SET model_id = 'claude-opus-4.5' WHERE model_id = 'claude-opus-4-5';
        UPDATE usage_records SET model_id = 'claude-opus-4.5' WHERE model_id = 'claude-opus-4-5';
        UPDATE user_model_preferences SET model_id = 'claude-opus-4.5' WHERE model_id = 'claude-opus-4-5';
        UPDATE workflow_chat_messages SET model_id = 'claude-opus-4.5' WHERE model_id = 'claude-opus-4-5';

        -- Delete new model row
        DELETE FROM models WHERE id = 'claude-opus-4-5';
    ` );
};
