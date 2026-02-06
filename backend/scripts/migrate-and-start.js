import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';

const databaseUrl = process.env.DATABASE_URL;
const runMigrations = process.env.RUN_MIGRATIONS !== 'false';
const migrationsDir = process.env.MIGRATIONS_DIR ?? './migrations';
const maxAttempts = Number(process.env.MIGRATE_MAX_ATTEMPTS ?? '10');
const retryDelayMs = Number(process.env.MIGRATE_RETRY_DELAY_MS ?? '3000');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ensureBinary = async (path, label) => {
  try {
    await fs.access(path);
  } catch (error) {
    console.error(`[migrate] missing ${label} at ${path}`);
    throw error;
  }
};

const runCommand = (command, args) =>
  new Promise((resolve) => {
    const child = spawn(command, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let output = '';
    child.stdout.on('data', (chunk) => {
      output += chunk.toString();
      process.stdout.write(chunk);
    });
    child.stderr.on('data', (chunk) => {
      output += chunk.toString();
      process.stderr.write(chunk);
    });

    child.on('close', (code) => resolve({ code: code ?? 1, output }));
  });

const startServer = async () => {
  await ensureBinary('./node_modules/.bin/tsx', 'tsx');
  const child = spawn('./node_modules/.bin/tsx', ['dist/index.js'], {
    stdio: 'inherit',
  });
  child.on('exit', (code) => process.exit(code ?? 0));
};

const runMigrateUp = async () => {
  await ensureBinary('./node_modules/.bin/node-pg-migrate', 'node-pg-migrate');
  const args = [
    'up',
    '--tsconfig',
    './tsconfig.json',
    '--migrations-dir',
    migrationsDir,
    '--verbose',
  ];
  return runCommand('./node_modules/.bin/node-pg-migrate', args);
};

if (!databaseUrl || !runMigrations) {
  console.log('[migrate] skipping migrations');
  await startServer();
  return;
}

for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  console.log(`[migrate] running migrations (attempt ${attempt}/${maxAttempts})`);
  const result = await runMigrateUp();

  if (result.code === 0) {
    console.log('[migrate] migrations complete');
    await startServer();
    return;
  }

  if (result.output.includes('Another migration is already running')) {
    console.log(
      `[migrate] migration lock detected, retrying in ${retryDelayMs}ms`
    );
    await sleep(retryDelayMs);
    continue;
  }

  console.error('[migrate] migration failed');
  process.exit(result.code);
}

console.error('[migrate] migrations did not complete before retry limit');
process.exit(1);
