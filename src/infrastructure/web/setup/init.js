import { setupDI } from './di.js';
import { setupDB } from './db.js';
import { setupServices } from './services.js';
import { setupRepos } from './repos.js';
import { setupPlugins } from './plugins.js';
import { setupRoutes } from './routes.js';
import { setupErrorHandling } from './error.js';

const init = async (fastify) => {
  await setupDI(fastify);

  await setupDB(fastify);

  await setupServices(fastify);

  await setupRepos(fastify);

  await setupPlugins(fastify);

  await setupRoutes(fastify);

  await setupErrorHandling(fastify);

  const { queryLoaderService, setupRepo } = fastify.di;

  await queryLoaderService.init();

  if (fastify.initDB) {
    await setupRepo.exec();
  }
};

export { init };
