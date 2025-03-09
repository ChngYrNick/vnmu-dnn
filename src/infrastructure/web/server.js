import Fastify from 'fastify';
import { setupPlugins } from './setup/plugins.js';
import { setupRoutes } from './setup/routes.js';
import { setupRepos } from './setup/repos.js';
import { setupServices } from './setup/services.js';
import { setupDI } from './setup/di.js';

const start = async () => {
  const fastify = Fastify({
    logger: true,
  });

  await setupDI(fastify);

  await setupPlugins(fastify);

  await setupServices(fastify);

  await setupRepos(fastify);

  await setupRoutes(fastify);

  fastify.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });
};

export { start };
