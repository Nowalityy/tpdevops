const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const taskRoutes = require('./routes/tasks');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.get('/config', (req, res) => {
  res.json({
    port: process.env.PORT || 3000,
    hasApiKey: !!process.env.API_KEY,
    environment: process.env.NODE_ENV || 'development',
    dbHost: process.env.DB_HOST || 'localhost',
    message: `Running in ${process.env.NODE_ENV || 'development'} mode`,
  });
});

app.get('/db-test', async (req, res, next) => {
  try {
    const { pool } = require('./db');
    const result = await pool.query('SELECT NOW() AS now');
    res.json({
      success: true,
      time: result.rows[0].now,
      dbHost: process.env.DB_HOST,
    });
  } catch (err) {
    next(err);
  }
});

app.use('/api/tasks', taskRoutes);

app.use(errorHandler);

module.exports = app;
