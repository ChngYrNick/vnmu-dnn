import path from 'node:path';
import nunjucks from 'nunjucks';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import { fastifySession } from '@fastify/session';
import { fastifyCookie } from '@fastify/cookie';

const setupPlugins = async (fastify) => {
  fastify.register(fastifyStatic, {
    root: path.join(process.cwd(), 'dist/public'),
    prefix: '/public/',
  });

  fastify.register(fastifyView, {
    engine: { nunjucks },
    root: path.join(process.cwd(), 'dist/views'),
  });

  fastify.register(fastifyCookie);

  fastify.register(fastifySession, {
    cookieName: 'sessionId',
    secret: process.env.SESSION_SECRET,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 86400000,
    },
    store: fastify.di.sessionsSyncRepo,
    rolling: true,
    saveUninitialized: false,
  });
};

export { setupPlugins };
