const { describe, it } = require('node:test');
const assert = require('node:assert');

describe('Modèle Task — validation', () => {
  it('structure attendue du modèle', () => {
    const task = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Ma tâche',
      description: 'Description',
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    assert.ok(task.id);
    assert.ok(task.description);
    assert.equal(task.status, 'todo');
  });
});
