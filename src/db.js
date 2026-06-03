const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.POSTGRES_DB || process.env.DB_NAME || 'todo_db',
  user: process.env.POSTGRES_USER || process.env.DB_USER || 'todo_user',
  password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD || 'todo_pass',
});

async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY,
        title VARCHAR(255),
        description TEXT NOT NULL DEFAULT '',
        status VARCHAR(50) NOT NULL DEFAULT 'todo',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  } finally {
    client.release();
  }
}

async function waitForDb(retries = 30, delayMs = 2000) {
  for (let i = 1; i <= retries; i += 1) {
    try {
      await pool.query('SELECT 1');
      return;
    } catch (err) {
      if (i === retries) throw err;
      console.log(`Attente PostgreSQL... (${i}/${retries})`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

module.exports = { pool, initDb, waitForDb };
