import path from 'node:path';
import nunjucks from 'nunjucks';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';

const setupPlugins = async (fastify) => {
  fastify.register(fastifyStatic, {
    root: path.join(process.cwd(), 'dist/public'),
    prefix: '/public/',
  });

  fastify.register(fastifyView, {
    engine: { nunjucks },
    root: path.join(process.cwd(), 'dist/views'),
  });
};

export { setupPlugins };
