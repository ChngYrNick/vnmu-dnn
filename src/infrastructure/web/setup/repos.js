import path from 'node:path';
import fs from 'fs/promises';
import Database from 'better-sqlite3';
import { QueryLoaderService } from '../../repos/loader.js';
import { SetupRepo } from '../../repos/setup/setup.js';

const setupRepos = async () => {
  const dbPath = path.join(process.cwd(), 'data', 'app.db');
  const queryDir = path.join(process.cwd(), 'src/infrastructure/repos');
  const initDB = await fs
    .access(dbPath)
    .then(() => false)
    .catch(() => true);
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  const queryLoader = new QueryLoaderService(queryDir);
  await queryLoader.init();
  if (initDB) {
    const setupRepo = new SetupRepo(db, queryLoader);
    await setupRepo.exec();
  }
};

export { setupRepos };
