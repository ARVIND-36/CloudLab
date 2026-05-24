import pg from 'pg';
import { env } from './env.js';
import { logger } from './logger.js';

const { Pool } = pg;

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (error) => {
  logger.error('Unexpected PostgreSQL pool error', { error: error.message });
});

export async function query(text, params) {
  return pool.query(text, params);
}

export async function closeDatabase() {
  await pool.end();
}

export { pool };