const { describe, it, before } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../../src/app');
const { initDb, waitForDb } = require('../../src/db');

describe('API /api/tasks', () => {
  before(async () => {
    if (process.env.SKIP_DB_TESTS === '1') return;
    await waitForDb();
    await initDb();
  });

  it('GET /health retourne ok', async () => {
    const res = await request(app).get('/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
  });

  it('CRUD complet sur les tâches', async () => {
    if (process.env.SKIP_DB_TESTS === '1') {
      console.log('SKIP_DB_TESTS=1 — tests integration ignorés');
      return;
    }

    const createRes = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Tâche test',
        description: 'Description test',
        status: 'todo',
      });
    assert.equal(createRes.status, 201);
    assert.ok(createRes.body.id);

    const id = createRes.body.id;

    const listRes = await request(app).get('/api/tasks');
    assert.equal(listRes.status, 200);
    assert.ok(listRes.body.some((t) => t.id === id));

    const getRes = await request(app).get(`/api/tasks/${id}`);
    assert.equal(getRes.status, 200);
    assert.equal(getRes.body.title, 'Tâche test');

    const updateRes = await request(app)
      .put(`/api/tasks/${id}`)
      .send({ status: 'done' });
    assert.equal(updateRes.status, 200);
    assert.equal(updateRes.body.status, 'done');

    const deleteRes = await request(app).delete(`/api/tasks/${id}`);
    assert.equal(deleteRes.status, 204);
  });
});
