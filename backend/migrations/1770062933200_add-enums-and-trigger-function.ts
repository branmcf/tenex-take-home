import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        -- Create enums for message roles and workflow/step statuses
        CREATE TYPE message_role AS ENUM ('user', 'assistant', 'system');
        CREATE TYPE workflow_run_status AS ENUM ('running', 'passed', 'failed', 'cancelled');
        CREATE TYPE step_run_status AS ENUM ('queued', 'running', 'passed', 'failed', 'cancelled');

        -- Create trigger function for automatically updating updated_at columns
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    ` );
};

export const down = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        DROP FUNCTION IF EXISTS update_updated_at_column();
        DROP TYPE IF EXISTS step_run_status;
        DROP TYPE IF EXISTS workflow_run_status;
        DROP TYPE IF EXISTS message_role;
    ` );
};
