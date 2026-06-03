const { randomUUID } = require('crypto');
const { pool } = require('../db');

function mapRow(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function findAll() {
  const { rows } = await pool.query(
    'SELECT * FROM tasks ORDER BY created_at DESC'
  );
  return rows.map(mapRow);
}

async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
  return rows[0] ? mapRow(rows[0]) : null;
}

async function create({ title, description, status }) {
  const id = randomUUID();
  const { rows } = await pool.query(
    `INSERT INTO tasks (id, title, description, status)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [id, title || null, description || '', status || 'todo']
  );
  return mapRow(rows[0]);
}

async function update(id, { title, description, status }) {
  const { rows } = await pool.query(
    `UPDATE tasks
     SET title = COALESCE($2, title),
         description = COALESCE($3, description),
         status = COALESCE($4, status),
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, title, description, status]
  );
  return rows[0] ? mapRow(rows[0]) : null;
}

async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = { findAll, findById, create, update, remove };
