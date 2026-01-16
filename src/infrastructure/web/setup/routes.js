import { SignInUseCase } from '../../../application/use-cases/sign-in.js';
import { LogoutUseCase } from '../../../application/use-cases/logout.js';
import { SignUpUseCase } from '../../../application/use-cases/sign-up.js';
import { ADMIN_PAGES, PAGES } from '../plugins/view/pages.js';
import { tryCatch } from '../../../common/utils.js';
import { Roles } from '../../../domain/roles.js';
import { BadRequestError } from '../../../domain/errors/bad-request.js';
import {
  changeLanguageSchema,
  signInSchema,
  signUpSchema,
  updateProfileSchema,
  logoutQuerySchema,
} from './validation-schemas.js';
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
import { GetUsersUseCase } from '../../../application/use-cases/get-users.js';
import { GetUserDetailsUseCase } from '../../../application/use-cases/get-user-details.js';
import { EditUserUseCase } from '../../../application/use-cases/edit-user.js';
import { ChangeLanguageUseCase } from '../../../application/use-cases/change-language.js';
import { DeleteUserUseCase } from '../../../application/use-cases/delete-user.js';
import { GetSpecialtiesUseCase } from '../../../application/use-cases/get-specialties.js';
import { AddSpecialityUseCase } from '../../../application/use-cases/add-speciality.js';
import { GetSpecialtyDetailsUseCase } from '../../../application/use-cases/get-specialty-details.js';
import { UpdateSpecialtyContentUseCase } from '../../../application/use-cases/update-specialty-content.js';
import { DeleteSpecialtyUseCase } from '../../../application/use-cases/delete-specialty.js';
import { AddStudentMaterialUseCase } from '../../../application/use-cases/add-student-material.js';
import { GetStudentMaterialDetailsUseCase } from '../../../application/use-cases/get-student-material-details.js';
import { GetStudentMaterialContentUseCase } from '../../../application/use-cases/get-student-material-content.js';
import { UpdateStudentMaterialContentUseCase } from '../../../application/use-cases/update-student-material-content.js';
import { GetStudentMaterialFilesUseCase } from '../../../application/use-cases/get-student-material-files.js';
import { UploadStudentMaterialFileUseCase } from '../../../application/use-cases/upload-student-material-file.js';
import { DeleteStudentMaterialUseCase } from '../../../application/use-cases/delete-student-material.js';
import { GetStudentPageDetailsUseCase } from '../../../application/use-cases/get-student-page-details.js';
import { GetStaffUseCase } from '../../../application/use-cases/get-staff.js';
import { AddStaffUseCase } from '../../../application/use-cases/add-staff.js';
import { GetStaffDetailsUseCase } from '../../../application/use-cases/get-staff-details.js';
import { UpdateStaffUseCase } from '../../../application/use-cases/update-staff.js';
import { UpdateStaffContentUseCase } from '../../../application/use-cases/update-staff-content.js';
import { GetStaffContentUseCase } from '../../../application/use-cases/get-staff-content.js';
import { UpdateStaffContentDataUseCase } from '../../../application/use-cases/update-staff-content-data.js';
import { ToggleStaffPublishedUseCase } from '../../../application/use-cases/toggle-staff-published.js';
import { DeleteStaffUseCase } from '../../../application/use-cases/delete-staff.js';
import { UploadStaffFileUseCase } from '../../../application/use-cases/upload-staff-file.js';
import { GetStaffFilesUseCase } from '../../../application/use-cases/get-staff-files.js';
import { GetStaffPageDetailsUseCase } from '../../../application/use-cases/get-staff-page-details.js';
import { GetNewsUseCase } from '../../../application/use-cases/get-news.js';
import { CreateNewsUseCase } from '../../../application/use-cases/create-news.js';
import { GetNewsDetailsUseCase } from '../../../application/use-cases/get-news-details.js';
import { ToggleNewsPublishedUseCase } from '../../../application/use-cases/toggle-news-published.js';
import { DeleteNewsUseCase } from '../../../application/use-cases/delete-news.js';
import { GetNewsContentUseCase } from '../../../application/use-cases/get-news-content.js';
import { UpdateNewsContentDataUseCase } from '../../../application/use-cases/update-news-content-data.js';
import { UpdateNewsTitleUseCase } from '../../../application/use-cases/update-news-title.js';
import { GetNewsFilesUseCase } from '../../../application/use-cases/get-news-files.js';
import { UploadNewsFileUseCase } from '../../../application/use-cases/upload-news-file.js';
import { GetPublishedNewsPaginatedUseCase } from '../../../application/use-cases/get-published-news-paginated.js';

const setupRoutes = async (fastify) => {
  fastify.get('/', async (request, reply) => {
    const useCase = new GetHomePageDetailsUseCase(request.di);
    const data = await useCase.exec({
      language: request.i18n.resolvedLanguage,
    });

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

  fastify.get('/student', async (request, reply) => {
    const { specialty, course } = request.query;
    const language = request.i18n.resolvedLanguage;

    const useCase = new GetStudentPageDetailsUseCase(request.di);
    const result = await useCase.exec({
      specialtySlug: specialty || null,
      course: course ? parseInt(course, 10) : null,
      language,
    });

    if (!specialty && result.specialties.length > 0) {
      const firstSpecialty = result.specialties[0];
      const firstCourse = result.courses[0]?.course || 1;
      return reply.redirect(
        `/student?specialty=${firstSpecialty.slug}&course=${firstCourse}`,
      );
    }

    if (specialty && !course && result.courses.length > 0) {
      return reply.redirect(
        `/student?specialty=${specialty}&course=${result.courses[0].course}`,
      );
    }

    return reply
      .header('Vary', 'Cookie')
      .header('Cache-Control', 'private, max-age=300')
      .view('pages/student.html', {
        page: PAGES.Student,
        user: request.session.data,
        title: request.i18n.t('nav.student'),
        data: result,
        selectedSpecialty: specialty || null,
        selectedCourse: course ? parseInt(course, 10) : null,
        content: result.content?.data || '',
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
    const result = changeLanguageSchema.safeParse(request.body);
    if (!result.success) {
      throw new BadRequestError(result.error.issues[0]?.message);
    }
    const useCase = new ChangeLanguageUseCase(request.di);
    await useCase.exec(result.data.language);
    const referer = request.headers.referer || '/';
    return reply.redirect(referer);
  });

  fastify.post('/sign-in', async (request, reply) => {
    const result = signInSchema.safeParse(request.body);
    if (!result.success) {
      const params = new URLSearchParams({
        error: result.error.issues[0]?.message || 'Invalid input',
      });
      return reply.redirect(`/sign-in?${params.toString()}`);
    }
    const useCase = new SignInUseCase(request.di);
    const { error } = await tryCatch(useCase.exec(result.data));
    if (!error) {
      return reply.redirect('/');
    }
    const { description } = request.di.errorService.handle(error);
    const params = new URLSearchParams({ error: description });
    return reply.redirect(`/sign-in?${params.toString()}`);
  });

  fastify.post('/sign-up', async (request, reply) => {
    const result = signUpSchema.safeParse(request.body);
    if (!result.success) {
      const params = new URLSearchParams({
        error: result.error.issues[0]?.message || 'Invalid input',
      });
      return reply.redirect(`/sign-up?${params.toString()}`);
    }
    const useCase = new SignUpUseCase(request.di);
    const { error } = await tryCatch(useCase.exec(result.data));
    if (!error) {
      return reply.redirect('/sign-up-success');
    }
    const { description } = request.di.errorService.handle(error);
    const params = new URLSearchParams({ error: description });
    return reply.redirect(`/sign-up?${params.toString()}`);
  });

  fastify.post('/update-profile', async (request, reply) => {
    const result = updateProfileSchema.safeParse(request.body);
    if (!result.success) {
      throw new BadRequestError(result.error.issues[0]?.message);
    }
    const useCase = new UpdateProfileUseCase(request.di);
    await useCase.exec(result.data);
    return reply.redirect('/profile-update-success');
  });

  fastify.post('/logout', async (request, reply) => {
    const result = logoutQuerySchema.safeParse(request.query);
    if (!result.success) {
      throw new BadRequestError(result.error.issues[0]?.message);
    }
    const useCase = new LogoutUseCase(request.di);
    await useCase.exec();
    const redirect = result.data.redirect;
    const href =
      redirect && redirect.startsWith('/')
        ? redirect
        : request.headers.referer || '/';
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
    const useCase = new GetNewsUseCase(request.di);
    const result = await useCase.exec();

    return reply.view('pages/admin/news.html', {
      page: ADMIN_PAGES.News,
      data: { news: result },
    });
  });

  fastify.post('/admin/news', async (request, reply) => {
    const useCase = new CreateNewsUseCase(request.di);
    await useCase.exec(request.body);
    return reply.redirect('/admin/news');
  });

  fastify.get('/admin/news/edit/:newsId', async (request, reply) => {
    const { newsId } = request.params;
    const { lang, status } = request.query;

    if (request.session.data?.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }

    if (!lang) {
      return reply.redirect(
        `/admin/news/edit/${newsId}?lang=${request.i18n.resolvedLanguage}`,
      );
    }

    const useCase = new GetNewsDetailsUseCase(request.di);
    const data = await useCase.exec({ newsId, language: lang });

    return reply.view('pages/admin/edit-news.html', {
      page: ADMIN_PAGES.News,
      newsId,
      language: lang,
      data,
      status,
    });
  });

  fastify.post('/admin/news/edit/:newsId', async (request, reply) => {
    const { newsId } = request.params;
    const { lang, title } = request.body;

    const useCase = new UpdateNewsTitleUseCase(request.di);
    await useCase.exec({ newsId, language: lang, title });

    return reply.redirect(
      `/admin/news/edit/${newsId}?lang=${lang}&status=success`,
    );
  });

  fastify.delete('/admin/news/edit/:newsId', async (request, reply) => {
    const { newsId } = request.params;
    const useCase = new DeleteNewsUseCase(request.di);
    await useCase.exec(newsId);
    return reply.code(303).redirect('/admin/news');
  });

  fastify.post('/admin/news/edit/:newsId/publish', async (request, reply) => {
    const { newsId } = request.params;
    const { lang, published } = request.body;

    const useCase = new ToggleNewsPublishedUseCase(request.di);
    await useCase.exec({ newsId, published: published === 'true' });

    return reply.redirect(`/admin/news/edit/${newsId}?lang=${lang}`);
  });

  fastify.get('/admin/news/text/:newsId', async (request, reply) => {
    const { newsId } = request.params;
    const { lang } = request.query;

    if (request.session.data?.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }

    const useCase = new GetNewsContentUseCase(request.di);
    const { error, data } = await tryCatch(useCase.exec(newsId, lang));

    if (error) {
      request.log.error(error);
      const processedError = request.di.errorService.handle(error);
      return reply.code(processedError.code).send(processedError);
    }

    return data ? reply.code(200).send(data) : reply.code(404).send();
  });

  fastify.put('/admin/news/text/:newsId', async (request, reply) => {
    const { newsId } = request.params;
    const { lang } = request.query;

    const useCase = new UpdateNewsContentDataUseCase(request.di);
    const { error, data } = await tryCatch(
      useCase.exec({ newsId, language: lang, data: request.body }),
    );

    if (error) {
      request.log.error(error);
      const processedError = request.di.errorService.handle(error);
      return reply.code(processedError.code).send(processedError);
    }

    return reply.code(200).send(data);
  });

  fastify.get('/content/news/:newsId', async (request, reply) => {
    const { newsId } = request.params;

    const useCase = new GetNewsFilesUseCase(request.di);
    const { error, data } = await tryCatch(useCase.exec(newsId));

    if (error) {
      request.log.error(error);
      const processedError = request.di.errorService.handle(error);
      return reply.code(processedError.code).send(processedError);
    }

    return reply.code(200).send(data);
  });

  fastify.post('/admin/news/uploads/:newsId', async (request, reply) => {
    const { newsId } = request.params;
    const data = await request.file();

    const useCase = new UploadNewsFileUseCase(request.di);
    const result = await tryCatch(useCase.exec({ newsId, data }));

    if (result.error) {
      request.log.error(result.error);
      const processedError = request.di.errorService.handle(result.error);
      return reply.code(processedError.code).send(processedError);
    }

    return reply.code(200).send(result.data);
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

  fastify.get('/admin/specialties', async (request, reply) => {
    if (request.session.data?.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }
    const useCase = new GetSpecialtiesUseCase(request.di);
    const result = await useCase.exec();

    return reply.view('pages/admin/specialties.html', {
      page: ADMIN_PAGES.Specialties,
      data: { specialties: result },
    });
  });

  fastify.post('/admin/specialties', async (request, reply) => {
    const useCase = new AddSpecialityUseCase(request.di);
    await useCase.exec(request.body);
    return reply.redirect('/admin/specialties');
  });

  fastify.get('/admin/specialties/:id', async (request, reply) => {
    const { id } = request.params;
    const { lang } = request.query;
    const { status } = request.query;

    if (request.session.data?.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }

    if (!lang) {
      return reply.redirect(
        `/admin/specialties/${id}?lang=${request.i18n.resolvedLanguage}`,
      );
    }

    const useCase = new GetSpecialtyDetailsUseCase(request.di);
    const data = await useCase.exec({ specialtyId: id, language: lang });

    return reply.view('pages/admin/speciality.html', {
      page: ADMIN_PAGES.Specialties,
      specialtyId: id,
      language: lang,
      data,
      status,
    });
  });

  fastify.post('/admin/specialties/:id', async (request, reply) => {
    const { id } = request.params;
    const { lang } = request.body;
    const { name } = request.body;

    const useCase = new UpdateSpecialtyContentUseCase(request.di);
    await useCase.exec({ specialtyId: id, language: lang, name });

    return reply.redirect(
      `/admin/specialties/${id}?lang=${lang}&status=success`,
    );
  });

  fastify.delete('/admin/specialties/:id', async (request, reply) => {
    const { id } = request.params;
    const useCase = new DeleteSpecialtyUseCase(request.di);
    await useCase.exec(id);
    return reply.code(303).redirect('/admin/specialties');
  });

  fastify.post('/admin/specialties/:id/material', async (request, reply) => {
    const { id } = request.params;
    const { course, lang } = request.body;

    const useCase = new AddStudentMaterialUseCase(request.di);
    await useCase.exec({ specialtyId: id, course: parseInt(course, 10) });

    return reply.redirect(`/admin/specialties/${id}?lang=${lang}`);
  });

  fastify.get(
    '/admin/specialties/:specialtyId/course/:courseId',
    async (request, reply) => {
      const { specialtyId, courseId } = request.params;
      const { lang } = request.query;

      if (request.session.data?.role !== Roles.ADMIN) {
        throw new ForbiddenError();
      }

      if (!lang) {
        return reply.redirect(
          `/admin/specialties/${specialtyId}/course/${courseId}?lang=${request.i18n.resolvedLanguage}`,
        );
      }

      const useCase = new GetStudentMaterialDetailsUseCase(request.di);
      const data = await useCase.exec({ materialId: courseId, language: lang });

      return reply.view('pages/admin/course-edit.html', {
        page: ADMIN_PAGES.Specialties,
        specialtyId,
        materialId: courseId,
        language: lang,
        data,
      });
    },
  );

  fastify.delete(
    '/admin/specialties/:specialtyId/course/:courseId',
    async (request, reply) => {
      const { specialtyId, courseId } = request.params;
      const { lang } = request.query;

      const useCase = new DeleteStudentMaterialUseCase(request.di);
      await useCase.exec(courseId);

      return reply
        .code(303)
        .redirect(`/admin/specialties/${specialtyId}?lang=${lang}`);
    },
  );

  fastify.get('/admin/material/text/:materialId', async (request, reply) => {
    const { materialId } = request.params;
    const { lang } = request.query;

    if (request.session.data?.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }

    const useCase = new GetStudentMaterialContentUseCase(request.di);
    const { error, data } = await tryCatch(useCase.exec(materialId, lang));

    if (error) {
      request.log.error(error);
      const processedError = request.di.errorService.handle(error);
      return reply.code(processedError.code).send(processedError);
    }

    return data ? reply.code(200).send(data) : reply.code(404).send();
  });

  fastify.put('/admin/material/text/:materialId', async (request, reply) => {
    const { materialId } = request.params;
    const { lang } = request.query;

    const useCase = new UpdateStudentMaterialContentUseCase(request.di);
    const { error, data } = await tryCatch(
      useCase.exec({ materialId, language: lang, data: request.body }),
    );

    if (error) {
      request.log.error(error);
      const processedError = request.di.errorService.handle(error);
      return reply.code(processedError.code).send(processedError);
    }

    return reply.code(200).send(data);
  });

  fastify.get('/content/material/:materialId', async (request, reply) => {
    const { materialId } = request.params;

    const useCase = new GetStudentMaterialFilesUseCase(request.di);
    const { error, data } = await tryCatch(useCase.exec(materialId));

    if (error) {
      request.log.error(error);
      const processedError = request.di.errorService.handle(error);
      return reply.code(processedError.code).send(processedError);
    }

    return reply.code(200).send(data);
  });

  fastify.post(
    '/admin/material/uploads/:materialId',
    async (request, reply) => {
      const { materialId } = request.params;
      const data = await request.file();

      const useCase = new UploadStudentMaterialFileUseCase(request.di);
      const result = await tryCatch(useCase.exec({ materialId, data }));

      if (result.error) {
        request.log.error(result.error);
        const processedError = request.di.errorService.handle(result.error);
        return reply.code(processedError.code).send(processedError);
      }

      return reply.code(200).send(result.data);
    },
  );

  fastify.get('/admin/users', async (request, reply) => {
    if (request.session.data?.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }
    const useCase = new GetUsersUseCase(request.di);
    const result = await useCase.exec();

    return reply.view('pages/admin/users.html', {
      page: ADMIN_PAGES.Users,
      data: { users: result },
    });
  });

  fastify.get('/admin/user/edit/:userId', async (request, reply) => {
    const { userId } = request.params;
    const { status } = request.query;

    if (request.session.data?.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }
    const useCase = new GetUserDetailsUseCase(request.di);
    const data = await useCase.exec(userId);

    return reply.view('pages/admin/edit-user.html', {
      page: ADMIN_PAGES.Users,
      user: request.session.data,
      status,
      data,
    });
  });

  fastify.post('/admin/user/edit/:userId', async (request, reply) => {
    const { userId } = request.params;
    const useCase = new EditUserUseCase(request.di);
    await useCase.exec({ userId, data: request.body });
    return reply.redirect(`/admin/user/edit/${userId}?status=success`);
  });

  fastify.delete('/admin/user/edit/:userId', async (request, reply) => {
    const { userId } = request.params;
    const useCase = new DeleteUserUseCase(request.di);
    await useCase.exec(userId);
    return reply.code(303).redirect(`/admin/users`);
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

  // Public staff page
  fastify.get('/staff', async (request, reply) => {
    const language = request.i18n.resolvedLanguage;

    const useCase = new GetStaffPageDetailsUseCase(request.di);
    const result = await useCase.exec({ language });

    return reply
      .header('Vary', 'Cookie')
      .header('Cache-Control', 'private, max-age=300')
      .view('pages/staff.html', {
        page: PAGES.Staff,
        user: request.session.data,
        title: request.i18n.t('nav.staff'),
        data: result,
      });
  });

  // Public news page
  fastify.get('/news', async (request, reply) => {
    const { page } = request.query;

    if (!page) {
      return reply.redirect('/news?page=1');
    }

    const language = request.i18n.resolvedLanguage;
    const pageNum = parseInt(page, 10) || 1;
    const limit = 3;

    const useCase = new GetPublishedNewsPaginatedUseCase(request.di);
    const result = await useCase.exec({ page: pageNum, limit, language });

    return reply
      .header('Vary', 'Cookie')
      .header('Cache-Control', 'private, max-age=300')
      .view('pages/news.html', {
        page: PAGES.News,
        user: request.session.data,
        title: request.i18n.t('nav.news'),
        data: result,
        currentPage: pageNum,
      });
  });

  // Admin staff routes
  fastify.get('/admin/staff', async (request, reply) => {
    if (request.session.data?.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }
    const useCase = new GetStaffUseCase(request.di);
    const result = await useCase.exec();

    return reply.view('pages/admin/staff.html', {
      page: ADMIN_PAGES.Staff,
      data: { staff: result },
    });
  });

  fastify.post('/admin/staff', async (request, reply) => {
    const useCase = new AddStaffUseCase(request.di);
    await useCase.exec(request.body);
    return reply.redirect('/admin/staff');
  });

  fastify.get('/admin/staff/edit/:staffId', async (request, reply) => {
    const { staffId } = request.params;
    const { lang, status } = request.query;

    if (request.session.data?.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }

    if (!lang) {
      return reply.redirect(
        `/admin/staff/edit/${staffId}?lang=${request.i18n.resolvedLanguage}`,
      );
    }

    const useCase = new GetStaffDetailsUseCase(request.di);
    const data = await useCase.exec({ staffId, language: lang });

    return reply.view('pages/admin/edit-staff.html', {
      page: ADMIN_PAGES.Staff,
      staffId,
      language: lang,
      data,
      status,
    });
  });

  fastify.post('/admin/staff/edit/:staffId', async (request, reply) => {
    const { staffId } = request.params;
    const { lang, name, position, email, phone, orderIndex } = request.body;

    const updateStaffUseCase = new UpdateStaffUseCase(request.di);
    await updateStaffUseCase.exec({ staffId, email, phone, orderIndex });

    const updateContentUseCase = new UpdateStaffContentUseCase(request.di);
    await updateContentUseCase.exec({
      staffId,
      language: lang,
      name,
      position,
    });

    return reply.redirect(
      `/admin/staff/edit/${staffId}?lang=${lang}&status=success`,
    );
  });

  fastify.delete('/admin/staff/edit/:staffId', async (request, reply) => {
    const { staffId } = request.params;
    const useCase = new DeleteStaffUseCase(request.di);
    await useCase.exec(staffId);
    return reply.code(303).redirect('/admin/staff');
  });

  fastify.post('/admin/staff/edit/:staffId/publish', async (request, reply) => {
    const { staffId } = request.params;
    const { lang, published } = request.body;

    const useCase = new ToggleStaffPublishedUseCase(request.di);
    await useCase.exec({ staffId, published: published === 'true' });

    return reply.redirect(`/admin/staff/edit/${staffId}?lang=${lang}`);
  });

  fastify.get('/admin/staff/text/:staffId', async (request, reply) => {
    const { staffId } = request.params;
    const { lang } = request.query;

    if (request.session.data?.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }

    const useCase = new GetStaffContentUseCase(request.di);
    const { error, data } = await tryCatch(useCase.exec(staffId, lang));

    if (error) {
      request.log.error(error);
      const processedError = request.di.errorService.handle(error);
      return reply.code(processedError.code).send(processedError);
    }

    return data ? reply.code(200).send(data) : reply.code(404).send();
  });

  fastify.put('/admin/staff/text/:staffId', async (request, reply) => {
    const { staffId } = request.params;
    const { lang } = request.query;

    const useCase = new UpdateStaffContentDataUseCase(request.di);
    const { error, data } = await tryCatch(
      useCase.exec({ staffId, language: lang, data: request.body }),
    );

    if (error) {
      request.log.error(error);
      const processedError = request.di.errorService.handle(error);
      return reply.code(processedError.code).send(processedError);
    }

    return reply.code(200).send(data);
  });

  fastify.get('/content/staff/:staffId', async (request, reply) => {
    const { staffId } = request.params;

    const useCase = new GetStaffFilesUseCase(request.di);
    const { error, data } = await tryCatch(useCase.exec(staffId));

    if (error) {
      request.log.error(error);
      const processedError = request.di.errorService.handle(error);
      return reply.code(processedError.code).send(processedError);
    }

    return reply.code(200).send(data);
  });

  fastify.post('/admin/staff/uploads/:staffId', async (request, reply) => {
    const { staffId } = request.params;
    const data = await request.file();

    const useCase = new UploadStaffFileUseCase(request.di);
    const result = await tryCatch(useCase.exec({ staffId, data }));

    if (result.error) {
      request.log.error(result.error);
      const processedError = request.di.errorService.handle(result.error);
      return reply.code(processedError.code).send(processedError);
    }

    return reply.code(200).send(result.data);
  });
};

export { setupRoutes };
