import { SignUpUseCase } from '../../../application/use-cases/sign-up.js';
import { PAGES } from '../plugins/view/pages.js';

const setupRoutes = async (fastify) => {
  fastify.get('/', async (request, reply) => {
    return reply
      .header('Vary', 'Cookie')
      .header('Cache-Control', 'private, max-age=300')
      .view('pages/home.html', {
        page: PAGES.Home,
        user: request.session.data,
      });
  });

  fastify.get('/about', async (request, reply) => {
    return reply
      .header('Vary', 'Cookie')
      .header('Cache-Control', 'private, max-age=300')
      .view('pages/about.html', {
        page: PAGES.About,
        user: request.session.data,
      });
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

  fastify.post('/sign-up', async (request, reply) => {
    const useCase = new SignUpUseCase(request.di);
    await useCase.exec(request.body);
    return reply.redirect('/');
  });
};

export { setupRoutes };
