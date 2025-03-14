import Fastify from 'fastify';
import { setupPlugins } from './setup/plugins.js';
import { setupRoutes } from './setup/routes.js';
import { setupRepos } from './setup/repos.js';
import { setupServices } from './setup/services.js';
import { setupDI } from './setup/di.js';
import { init } from './setup/init.js';
import { setupDB } from './setup/db.js';

const start = async () => {
  const fastify = Fastify({ logger: true });
  const port = process.env.PORT || 3000;
  const host = process.env.HOST || '127.0.0.1';

  await setupDI(fastify);

  await setupDB(fastify);

  await setupServices(fastify);

  await setupRepos(fastify);

  await setupPlugins(fastify);

  await setupRoutes(fastify);

  await init(fastify);

  fastify.listen({ port, host }, (err) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });
};

export { start };
