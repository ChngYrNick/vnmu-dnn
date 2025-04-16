import { SignInUseCase } from '../../../application/use-cases/sign-in.js';
import { LogoutUseCase } from '../../../application/use-cases/logout.js';
import { SignUpUseCase } from '../../../application/use-cases/sign-up.js';
import { ADMIN_PAGES, PAGES } from '../plugins/view/pages.js';
import { tryCatch } from '../../../common/utils.js';
import { Roles } from '../../../domain/roles.js';
import { ForbiddenError } from '../../../domain/errors/forbidden.js';
import { GetPagesUseCase } from '../../../application/use-cases/get-pages.js';

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
    const { error } = request.query;

    return reply
      .header('Vary', 'Cookie')
      .header('Cache-Control', 'private, max-age=300')
      .view('pages/sign-up.html', { page: PAGES.SignUp, error });
  });

  fastify.get('/sign-in', async (request, reply) => {
    const { error } = request.query;

    return reply
      .header('Vary', 'Cookie')
      .header('Cache-Control', 'private, max-age=300')
      .view('pages/sign-in.html', { page: PAGES.SignIn, error });
  });

  fastify.get('/error', async (request, reply) => {
    const { code, title, description } = request.query;

    return reply
      .header('Cache-Control', 'private, max-age=300')
      .view('pages/error.html', {
        page: PAGES.Error,
        code,
        title,
        description,
      });
  });

  fastify.get('/sign-up-success', async (request, reply) => {
    return reply
      .header('Vary', 'Cookie')
      .header('Cache-Control', 'private, max-age=300')
      .view('pages/message.html', {
        page: PAGES.Message,
        title: request.t('pages.message.signUpSuccess.title'),
        description: request.t('pages.message.signUpSuccess.description'),
      });
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

  fastify.post('/sign-in', async (request, reply) => {
    const useCase = new SignInUseCase(request.di);
    const { error } = await tryCatch(useCase.exec(request.body));
    if (!error) {
      return reply.redirect('/');
    }
    const { description } = request.di.errorService.handle(error);
    const params = new URLSearchParams({ error: description });
    return reply.redirect(`/sign-in?${params.toString()}`);
  });

  fastify.post('/sign-up', async (request, reply) => {
    const useCase = new SignUpUseCase(request.di);
    const { error } = await tryCatch(useCase.exec(request.body));
    if (!error) {
      return reply.redirect('/sign-up-success');
    }
    const { description } = request.di.errorService.handle(error);
    const params = new URLSearchParams({ error: description });
    return reply.redirect(`/sign-in?${params.toString()}`);
  });

  fastify.post('/logout', async (request, reply) => {
    const { redirect } = request.query;
    const useCase = new LogoutUseCase(request.di);
    await useCase.exec();
    const href = redirect || request.headers.referer || '/';
    return request.headers['hx-request']
      ? reply.header('HX-Redirect', href).status(200).send()
      : reply.redirect(href);
  });

  fastify.get('/admin', async (request, reply) => {
    if (request.session.data?.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }
    return reply.redirect('/admin/content');
  });

  fastify.get('/admin/news', async (request, reply) => {
    if (request.session.data?.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }
    return reply.view('pages/admin/news.html', {
      page: ADMIN_PAGES.News,
    });
  });

  fastify.get('/admin/content', async (request, reply) => {
    if (request.session.data?.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }
    const useCase = new GetPagesUseCase(request.di);
    const data = await useCase.exec();

    return reply.view('pages/admin/content.html', {
      page: ADMIN_PAGES.Content,
      data,
    });
  });
};

export { setupRoutes };
