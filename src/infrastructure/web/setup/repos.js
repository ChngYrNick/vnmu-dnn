import path from 'node:path';
import Database from 'better-sqlite3';
import { SQLLoaderService } from '../../repos/loader.js';
import { SetupRepo } from '../../repos/setup/setup.js';

const setupRepos = async (fastify) => {
  const sqlLoader = new SQLLoaderService(
    path.join(process.cwd(), 'src/infrastructure/repos'),
  );

  const db = new Database(path.join(process.cwd(), 'data', 'app.db'));
  db.pragma('journal_mode = WAL');

  await sqlLoader.init();

  const setupRepo = new SetupRepo(db, sqlLoader);

  await setupRepo.init();
};

export { setupRepos };
