import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async ( pgm: MigrationBuilder ): Promise<void> => {
    // e.g. pgm.createTable('users', { id: 'uuid', name: 'text' });
};

export const down = async ( pgm: MigrationBuilder ): Promise<void> => {
    // e.g. pgm.dropTable('users');
};
