const express = require('express');
const taskModel = require('../models/task');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    if (!description && !title) {
      return res.status(400).json({ error: 'title ou description requis' });
    }
    const task = await taskModel.create({ title, description, status });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const tasks = await taskModel.findAll();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const task = await taskModel.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Tâche introuvable' });
    }
    res.json(task);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const task = await taskModel.update(req.params.id, req.body);
    if (!task) {
      return res.status(404).json({ error: 'Tâche introuvable' });
    }
    res.json(task);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await taskModel.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Tâche introuvable' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
