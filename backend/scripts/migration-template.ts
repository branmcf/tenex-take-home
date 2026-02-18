import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const up = async ( pgm: MigrationBuilder ): Promise<void> => {
    // e.g. pgm.createTable('users', { id: 'uuid', name: 'text' });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const down = async ( pgm: MigrationBuilder ): Promise<void> => {
    // e.g. pgm.dropTable('users');
};
