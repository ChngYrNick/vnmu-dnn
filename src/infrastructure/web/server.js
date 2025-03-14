import Fastify from 'fastify';
import { init } from './setup/init.js';

const start = async () => {
  const fastify = Fastify({ logger: true });
  const port = process.env.PORT || 3000;
  const host = process.env.HOST || '127.0.0.1';

  await init(fastify);

  fastify.listen({ port, host }, (err) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });
};

export { start };
