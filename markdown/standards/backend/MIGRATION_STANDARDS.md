# Migration Standards

This document defines how we create and apply database migrations in this codebase. Follow this exactly for all new migrations.

## Create a Migration

Run the migration generator from the `backend` directory:

```bash
npm run migrate:create <MIGRATION_NAME>
```

This creates a new migration file using our project template. Do not hand-create migration files.

## Migration Format

All migrations must:
- Use raw SQL via `pgm.sql()`
- Export `shorthands` as `undefined`
- Implement `up` and `down` as async functions
- Use multi-line template strings for SQL
- Add comments inside the SQL if the script is large or complex

**Example template:**

```ts
import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export const up = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        INSERT INTO subscription_tiers (name, description, price_in_cents)
        VALUES
            ('Hobby', 'The best way to test drive workflow automation with n8n', '500'),
            ('Premium', 'Ideal for small businesses and automation aficionados', '2000'),
            ('Professional', 'Perfect for enterprises and automation agencies building at scale', '20000');
    ` );
};

export const down = async ( pgm: MigrationBuilder ): Promise<void> => {
    pgm.sql( `
        DELETE FROM subscription_tiers
        WHERE name IN ('Hobby', 'Premium', 'Professional');
    ` );
};
```

## Apply a Migration

From the `backend` directory, run:

```bash
npm run migrate:up
```

## Verify a Migration

After applying:
- Review terminal output for success messages, and/or
- Connect to the database and inspect the affected tables to confirm changes

## Notes

- Do not use `pgm.createTable`, `pgm.addColumn`, or other helpers.
- Keep SQL deterministic and reversible.
- Ensure `down` cleanly rolls back the `up` changes.
