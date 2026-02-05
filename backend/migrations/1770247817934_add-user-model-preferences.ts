import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        -- Store each user's preferred model selection
        CREATE TABLE user_model_preferences (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
            model_id TEXT NOT NULL REFERENCES models(id),
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE UNIQUE INDEX user_model_preferences_user_id_unique
            ON user_model_preferences(user_id);

        CREATE INDEX user_model_preferences_model_id_idx
            ON user_model_preferences(model_id);

        -- Trigger to auto-update updated_at
        CREATE TRIGGER user_model_preferences_updated_at
            BEFORE UPDATE ON user_model_preferences
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    ` );
};

export const down = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        DROP TRIGGER IF EXISTS user_model_preferences_updated_at ON user_model_preferences;
        DROP INDEX IF EXISTS user_model_preferences_model_id_idx;
        DROP INDEX IF EXISTS user_model_preferences_user_id_unique;
        DROP TABLE IF EXISTS user_model_preferences;
    ` );
};
