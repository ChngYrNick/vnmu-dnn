import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import Fastify from 'fastify';
import path from 'node:path';
import nunjucks from 'nunjucks';

const start = async () => {
  const fastify = Fastify({
    logger: true,
  });

  fastify.register(fastifyStatic, {
    root: path.join(process.cwd(), 'dist/public'),
    prefix: '/public/',
  });

  fastify.register(fastifyView, {
    engine: { nunjucks },
    root: path.join(process.cwd(), 'dist/views'),
  });

  fastify.get('/', async (request, reply) => {
    return reply.view('pages/home.html', {
      title: 'Home Page',
    });
  });

  fastify.get('/about', async (request, reply) => {
    return reply.view('pages/about.html', {
      title: 'About Page',
    });
  });

  fastify.listen({ port: 3000, host: '0.0.0.0' }, function (err) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });
};

export { start };
