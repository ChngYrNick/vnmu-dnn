import { PAGES } from '../plugins/view/pages.js';

const setupRoutes = async (fastify) => {
  fastify.get('/', async (request, reply) => {
    return reply
      .header('Vary', 'Cookie')
      .header('Cache-Control', 'private, max-age=300')
      .view('pages/home.html', { page: PAGES.Home });
  });

  fastify.get('/about', async (request, reply) => {
    return reply
      .header('Vary', 'Cookie')
      .header('Cache-Control', 'private, max-age=300')
      .view('pages/about.html', { page: PAGES.About });
  });

  fastify.get('/sign-up', async (request, reply) => {
    return reply
      .header('Vary', 'Cookie')
      .header('Cache-Control', 'private, max-age=300')
      .view('pages/sign-up.html', { page: PAGES.SignUp });
  });

  fastify.get('/sign-in', async (request, reply) => {
    return reply
      .header('Vary', 'Cookie')
      .header('Cache-Control', 'private, max-age=300')
      .view('pages/sign-in.html', { page: PAGES.SignIn });
  });

  fastify.post('/change-language', async (request, reply) => {
    const { language } = request.body;

    reply.setCookie('language', language, {
      path: '/',
      maxAge: 365 * 24 * 60 * 60,
      httpOnly: true,
      signed: false,
    });

    const referer = request.headers.referer || '/';
    return reply.redirect(referer);
  });
};

export { setupRoutes };
