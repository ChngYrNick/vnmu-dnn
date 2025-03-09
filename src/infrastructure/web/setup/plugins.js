import path from 'node:path';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import fastifyJwt from '@fastify/jwt';
import nunjucks from 'nunjucks';

const setupPlugins = async (fastify) => {
  fastify.register(fastifyStatic, {
    root: path.join(process.cwd(), 'dist/public'),
    prefix: '/public/',
  });

  fastify.register(fastifyView, {
    engine: { nunjucks },
    root: path.join(process.cwd(), 'dist/views'),
  });

  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'secret',
    sign: {
      expiresIn: '1h',
    },
  });
};

export { setupPlugins };
