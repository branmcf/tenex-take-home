import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        -- Models table: stores available LLM models for selection
        CREATE TABLE models (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            provider TEXT NOT NULL,
            input_price_per_million NUMERIC(10,4) CHECK (input_price_per_million >= 0),
            output_price_per_million NUMERIC(10,4) CHECK (output_price_per_million >= 0),
            is_active BOOLEAN NOT NULL DEFAULT true,
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        -- Trigger to auto-update updated_at
        CREATE TRIGGER models_updated_at
            BEFORE UPDATE ON models
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        -- Indexes
        CREATE INDEX models_provider_idx ON models(provider);
        CREATE INDEX models_is_active_idx ON models(is_active) WHERE is_active = true;
    ` );
};

export const down = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        DROP TRIGGER IF EXISTS models_updated_at ON models;
        DROP INDEX IF EXISTS models_is_active_idx;
        DROP INDEX IF EXISTS models_provider_idx;
        DROP TABLE IF EXISTS models;
    ` );
};
