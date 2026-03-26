import Fastify from 'fastify';
import { init } from './setup/init.js';

const start = async () => {
  const fastify = Fastify({ logger: true });
  const port = process.env.PORT || 3000;
  const host = process.env.HOST || '127.0.0.1';

  await init(fastify);

  const shutdown = async () => {
    fastify.log.info('Shutting down...');
    await fastify.close();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  fastify.listen({ port, host }, (err) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });
};

export { start };
