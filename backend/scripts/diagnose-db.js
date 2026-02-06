import pg from 'pg';

const { Client } = pg;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('[diagnose-db] DATABASE_URL is not set');
  process.exit(1);
}

const client = new Client({ connectionString: databaseUrl });

try {
  await client.connect();

  const info = await client.query(
    "select current_database() as db, current_user as user, inet_server_addr() as host, inet_server_port() as port, current_schema() as schema"
  );
  console.log('[diagnose-db] connection', info.rows[0]);

  const tableCheck = await client.query(
    "select to_regclass('public.pgmigrations') as table_name"
  );

  if (!tableCheck.rows[0]?.table_name) {
    console.log('[diagnose-db] pgmigrations table not found');
    process.exit(0);
  }

  const count = await client.query(
    'select count(*)::int as count from pgmigrations'
  );
  console.log('[diagnose-db] pgmigrations count', count.rows[0]?.count ?? 0);

  const recent = await client.query(
    'select name, run_on from pgmigrations order by id desc limit 5'
  );
  console.log('[diagnose-db] pgmigrations recent', recent.rows);
} catch (error) {
  console.error('[diagnose-db] error', error);
  process.exit(1);
} finally {
  await client.end().catch(() => undefined);
}
