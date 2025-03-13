import path from 'node:path';
import fs from 'fs/promises';
import Database from 'better-sqlite3';

const setupDB = async (fastify) => {
  const dbPath = path.join(process.cwd(), 'data', 'app.db');
  const initDB = await fs
    .access(dbPath)
    .then(() => false)
    .catch(() => true);
  fastify.decorate('initDB', initDB);
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  fastify.di.db = db;
  fastify.addHook('onRequest', (req, reply, done) => {
    req.di.db = db;
    done();
  });
};

export { setupDB };
