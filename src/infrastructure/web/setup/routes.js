import { SignInUseCase } from '../../../application/use-cases/sign-in.js';
import { LogoutUseCase } from '../../../application/use-cases/logout.js';
import { SignUpUseCase } from '../../../application/use-cases/sign-up.js';
import { ADMIN_PAGES, PAGES } from '../plugins/view/pages.js';
import { tryCatch } from '../../../common/utils.js';
import { Roles } from '../../../domain/roles.js';
import { ForbiddenError } from '../../../domain/errors/forbidden.js';
import { GetPagesUseCase } from '../../../application/use-cases/get-pages.js';
import { GetPageDetailsUseCase } from '../../../application/use-cases/get-page-details.js';
import { UploadPageFileUseCase } from '../../../application/use-cases/upload-page-file.js';
import { GetPageFilesUseCase } from '../../../application/use-cases/get-page-files.js';
import { DeleteFileUseCase } from '../../../application/use-cases/delete-file.js';
import { GetPageContentUseCase } from '../../../application/use-cases/get-page-content.js';
import { UpdatePageContentUseCase } from '../../../application/use-cases/update-page-content.js';
import { AddContactUseCase } from '../../../application/use-cases/add-contact.js';
import { GetContactsUseCase } from '../../../application/use-cases/get-contacts.js';
import { DeleteContactUseCase } from '../../../application/use-cases/delete-contact.js';
import { GetHomePageDetailsUseCase } from '../../../application/use-cases/get-home-page-details.js';
import { UpdateProfileUseCase } from '../../../application/use-cases/update-profile.js';
import { GetProfilePageDetailsUseCase } from '../../../application/use-cases/get-profile-page-details.js';

const setupRoutes = async (fastify) => {
  fastify.get('/', async (request, reply) => {
    const useCase = new GetHomePageDetailsUseCase(request.di);
    const data = await useCase.exec();

    return reply
      .header('Vary', 'Cookie')
      .header('Cache-Control', 'private, max-age=300')
      .view('pages/home.html', {
        page: PAGES.Home,
        user: request.session.data,
        data,
      });
  });

  fastify.get('/about', async (request, reply) => {
    const useCase = new GetPageDetailsUseCase(request.di);
    const result = await useCase.exec({
      pageId: null,
      slug: '/about',
      language: request.i18n.resolvedLanguage,
    });

    return reply
      .header('Vary', 'Cookie')
      .header('Cache-Control', 'private, max-age=300')
      .view('pages/content.html', {
        page: PAGES.About,
        user: request.session.data,
        content: result.content?.data || '',
        title: request.i18n.t('nav.about'),
        data: result,
      });
  });

  fastify.get('/intern', async (request, reply) => {
    const useCase = new GetPageDetailsUseCase(request.di);
    const result = await useCase.exec({
      pageId: null,
      slug: '/intern',
      language: request.i18n.resolvedLanguage,
    });

    return reply
      .header('Vary', 'Cookie')
      .header('Cache-Control', 'private, max-age=300')
      .view('pages/content.html', {
        page: PAGES.Intern,
        user: request.session.data,
        content: result.content?.data || '',
        title: request.i18n.t('nav.intern'),
        data: result,
      });
  });

  fastify.get('/listener', async (request, reply) => {
    const useCase = new GetPageDetailsUseCase(request.di);
    const result = await useCase.exec({
      pageId: null,
      slug: '/listener',
      language: request.i18n.resolvedLanguage,
    });

    return reply
      .header('Vary', 'Cookie')
      .header('Cache-Control', 'private, max-age=300')
      .view('pages/content.html', {
        page: PAGES.Listener,
        user: request.session.data,
        content: result.content?.data || '',
        title: request.i18n.t('nav.listener'),
        data: result,
      });
  });

  fastify.get('/syllabus', async (request, reply) => {
    const useCase = new GetPageDetailsUseCase(request.di);
    const result = await useCase.exec({
      pageId: null,
      slug: '/syllabus',
      language: request.i18n.resolvedLanguage,
    });

    return reply
      .header('Vary', 'Cookie')
      .header('Cache-Control', 'private, max-age=300')
      .view('pages/content.html', {
        page: PAGES.Syllabus,
        user: request.session.data,
        content: result.content?.data || '',
        title: request.i18n.t('nav.syllabus'),
        data: result,
      });
  });

  fastify.get('/literature', async (request, reply) => {
    const useCase = new GetPageDetailsUseCase(request.di);
    const result = await useCase.exec({
      pageId: null,
      slug: '/literature',
      language: request.i18n.resolvedLanguage,
    });

    return reply
      .header('Vary', 'Cookie')
      .header('Cache-Control', 'private, max-age=300')
      .view('pages/content.html', {
        page: PAGES.Literature,
        user: request.session.data,
        content: result.content?.data || '',
        title: request.i18n.t('nav.literature'),
        data: result,
      });
  });

  fastify.get('/profile', async (request, reply) => {
    const useCase = new GetProfilePageDetailsUseCase(request.di);
    const data = await useCase.exec();
    return reply.view('pages/profile.html', {
      page: PAGES.Profile,
      user: request.session.data,
      title: request.i18n.t('nav.profile'),
      data,
    });
  });

  fastify.get('/sign-up', async (request, reply) => {
    const { error } = request.query;

    return reply
      .header('Vary', 'Cookie')
      .header('Cache-Control', 'private, max-age=300')
      .view('pages/sign-up.html', {
        page: PAGES.SignUp,
        error,
        title: request.i18n.t('nav.signup'),
      });
  });

  fastify.get('/sign-in', async (request, reply) => {
    const { error } = request.query;

    return reply
      .header('Vary', 'Cookie')
      .header('Cache-Control', 'private, max-age=300')
      .view('pages/sign-in.html', {
        page: PAGES.SignIn,
        error,
        title: request.i18n.t('nav.signin'),
      });
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

  fastify.get('/profile-update-success', async (request, reply) => {
    return reply
      .header('Vary', 'Cookie')
      .header('Cache-Control', 'private, max-age=300')
      .view('pages/message.html', {
        page: PAGES.Message,
        title: request.t('pages.message.profileUpdateSuccess.title'),
        description: request.t(
          'pages.message.profileUpdateSuccess.description',
        ),
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
    return reply.redirect(`/sign-up?${params.toString()}`);
  });

  fastify.post('/update-profile', async (request, reply) => {
    const useCase = new UpdateProfileUseCase(request.di);
    await useCase.exec(request.body);
    return reply.redirect('/profile-update-success');
  });

  fastify.post('/logout', async (request, reply) => {
    const { redirect } = request.query;
    const useCase = new LogoutUseCase(request.di);
    await useCase.exec();
    const href = redirect || request.headers.referer || '/';
    reply.clearCookie('sessionId', { path: '/' });
    return reply.redirect(href);
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

  fastify.get('/admin/contacts', async (request, reply) => {
    if (request.session.data?.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }

    const useCase = new GetContactsUseCase(request.di);
    const data = await useCase.exec();

    return reply.view('pages/admin/contacts.html', {
      page: ADMIN_PAGES.Contacts,
      data,
    });
  });

  fastify.post('/admin/contacts', async (request, reply) => {
    const { type, value } = request.body;
    const useCase = new AddContactUseCase(request.di);
    await useCase.exec({ type, value });
    return reply.redirect('/admin/contacts');
  });

  fastify.delete('/admin/contacts', async (request, reply) => {
    const { contactId } = request.query;
    const useCase = new DeleteContactUseCase(request.di);
    await useCase.exec(contactId);
    return reply.code(303).redirect('/admin/contacts');
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

  fastify.get('/admin/content/edit/:pageId', async (request, reply) => {
    const { pageId } = request.params;
    const { lang } = request.query;

    if (request.session.data?.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }

    if (!lang) {
      return reply.redirect(
        `/admin/content/edit/${pageId}?lang=${request.i18n.resolvedLanguage}`,
      );
    }

    const useCase = new GetPageDetailsUseCase(request.di);
    const data = await useCase.exec({ pageId, slug: '', language: lang });

    return reply.view('pages/admin/edit-content.html', {
      page: ADMIN_PAGES.Content,
      pageId,
      language: lang,
      data,
    });
  });

  fastify.post('/admin/content/uploads/:pageId', async (request, reply) => {
    const { pageId } = request.params;
    const data = await request.file();
    const useCase = new UploadPageFileUseCase(request.di);
    const result = await tryCatch(useCase.exec({ pageId, data }));
    if (result.error) {
      request.log.error(result.error);
      const processedError = request.di.errorService.handle(result.error);
      return reply.code(processedError.code).send(processedError);
    }
    return reply.code(200).send(result.data);
  });

  fastify.get('/admin/content/text/:pageId', async (request, reply) => {
    const { pageId } = request.params;
    const { lang } = request.query;
    if (request.session.data?.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }
    const useCase = new GetPageContentUseCase(request.di);
    const { error, data } = await tryCatch(useCase.exec(pageId, lang));
    if (error) {
      request.log.error(error);
      const processedError = request.di.errorService.handle(error);
      return reply.code(processedError.code).send(processedError);
    }
    return data ? reply.code(200).send(data) : reply.code(404).send();
  });

  fastify.put('/admin/content/text/:pageId', async (request, reply) => {
    const { pageId } = request.params;
    const { lang } = request.query;
    const useCase = new UpdatePageContentUseCase(request.di);
    const { error, data } = await tryCatch(
      useCase.exec({ data: request.body, pageId, language: lang }),
    );
    if (error) {
      request.log.error(error);
      const processedError = request.di.errorService.handle(error);
      return reply.code(processedError.code).send(processedError);
    }
    return reply.code(200).send(data);
  });

  fastify.get('/content/uploads/:pageId', async (request, reply) => {
    const { pageId } = request.params;
    const useCase = new GetPageFilesUseCase(request.di);
    const { error, data } = await tryCatch(useCase.exec(pageId));
    if (error) {
      request.log.error(error);
      const processedError = request.di.errorService.handle(error);
      return reply.code(processedError.code).send(processedError);
    }
    return reply.code(200).send(data);
  });

  fastify.delete('/uploads/:fileId', async (request, reply) => {
    const { fileId } = request.params;
    const useCase = new DeleteFileUseCase(request.di);
    const { error, data } = await tryCatch(useCase.exec(fileId));
    if (error) {
      request.log.error(error);
      const processedError = request.di.errorService.handle(error);
      return reply.code(processedError.code).send(processedError);
    }
    return reply.code(200).send(data);
  });
};

export { setupRoutes };
