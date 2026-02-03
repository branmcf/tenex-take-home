import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        INSERT INTO models (id, name, provider, input_price_per_million, output_price_per_million)
        VALUES
            ('gemini-2.5-pro', 'gemini-2.5-pro', 'Google', 1.25, 10.00),
            ('gemini-2.5-flash', 'gemini-2.5-flash', 'Google', 0.30, 2.50),
            ('gemini-2.5-flash-lite', 'gemini-2.5-flash-lite', 'Google', 0.10, 0.40),
            ('gpt-5.2-pro', 'GPT-5.2 pro', 'OpenAI', 21.00, 168.00),
            ('gpt-5.2', 'GPT-5.2', 'OpenAI', 1.75, 14.00),
            ('gpt-5-mini', 'GPT-5 mini', 'OpenAI', 0.25, 2.00),
            ('claude-opus-4.5', 'Claude Opus 4.5', 'Anthropic', 5.00, 25.00),
            ('claude-sonnet-4.5', 'Claude Sonnet 4.5', 'Anthropic', 3.00, 15.00),
            ('claude-haiku-4.5', 'Claude Haiku 4.5', 'Anthropic', 1.00, 5.00);
    ` );
};

export const down = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        DELETE FROM models
        WHERE id IN (
            'gemini-2.5-pro',
            'gemini-2.5-flash',
            'gemini-2.5-flash-lite',
            'gpt-5.2-pro',
            'gpt-5.2',
            'gpt-5-mini',
            'claude-opus-4.5',
            'claude-sonnet-4.5',
            'claude-haiku-4.5'
        );
    ` );
};
