import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        -- Add GPT-4o to the models table (fallback model in provider selection)
        INSERT INTO models (id, name, provider, input_price_per_million, output_price_per_million, is_active)
        VALUES ('gpt-4o', 'GPT-4o', 'OpenAI', 2.50, 10.00, false)
        ON CONFLICT (id) DO NOTHING;
    ` );
};

export const down = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        DELETE FROM models
        WHERE id = 'gpt-4o';
    ` );
};
