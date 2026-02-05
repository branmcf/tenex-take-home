import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        UPDATE tools
        SET deleted_at = CURRENT_TIMESTAMP
        WHERE name = 'conditional'
            AND deleted_at IS NULL;
    ` );
};

export const down = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        UPDATE tools
        SET deleted_at = NULL
        WHERE name = 'conditional';
    ` );
};
