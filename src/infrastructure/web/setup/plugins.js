import path from 'node:path';
import nunjucks from 'nunjucks';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import { fastifyFormbody } from '@fastify/formbody';
import { fastifySession } from '@fastify/session';
import { fastifyCookie } from '@fastify/cookie';
import i18next from 'i18next';
import i18nextFSBackend from 'i18next-fs-backend';
import {
  LanguageDetector,
  plugin as fastifyI18next,
} from 'i18next-http-middleware';
import { ctx } from '../plugins/view/ctx.js';
import { getDefaultLang, getLangCodes } from '../../../domain/langs.js';

const setupPlugins = async (fastify) => {
  i18next
    .use(i18nextFSBackend)
    .use(LanguageDetector)
    .init({
      backend: {
        loadPath: path.join(
          process.cwd(),
          'src/infrastructure/web/locales/{{lng}}/{{ns}}.json',
        ),
      },
      fallbackLng: getDefaultLang().code,
      preload: getLangCodes(),
      load: 'languageOnly',
      detection: {
        order: ['cookie', 'querystring', 'header'],
        lookupCookie: 'language',
        cookieExpirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    });

  fastify.register(fastifyStatic, {
    root: path.join(process.cwd(), 'dist/public'),
    prefix: '/public/',
    preCompressed: true,
  });

  fastify.register(fastifyView, {
    engine: { nunjucks },
    root: path.join(process.cwd(), 'dist/views'),
    production: process.env.NODE_ENV === 'production',
    defaultContext: ctx,
  });

  fastify.register(fastifyFormbody);

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

  fastify.register(fastifyI18next, {
    i18next,
    ignoreRoutes: ['/public/'],
  });
};

export { setupPlugins };
