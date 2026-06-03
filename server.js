const fs = require('fs');
const path = require('path');
const app = require('./src/app');
const { initDb, waitForDb } = require('./src/db');

const PORT = process.env.PORT || 3000;
const LOG_DIR = process.env.LOG_DIR || '/app/logs';

async function start() {
  await waitForDb();
  await initDb();

  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
  const logFile = path.join(LOG_DIR, 'app.log');
  fs.appendFileSync(logFile, `[${new Date().toISOString()}] API démarrée\n`);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`API Todo sur http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Échec du démarrage:', err);
  process.exit(1);
});
