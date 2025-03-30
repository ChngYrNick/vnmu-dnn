import { NotFoundError } from '../../../domain/errors/not-found.js';

const setupErrorHandling = async (fastify) => {
  fastify.setErrorHandler((error, req, reply) => {
    const result = req.di.errorService.handle(error);
    const params = new URLSearchParams(result);
    const url = `/error?${params.toString()}`;
    return req.headers['hx-request']
      ? reply.header('HX-Redirect', url).status(200).send()
      : reply.redirect(url);
  });
  fastify.setNotFoundHandler((req, reply) => {
    const result = req.di.errorService.handle(new NotFoundError());
    const params = new URLSearchParams(result);
    const url = `/error?${params.toString()}`;
    return req.headers['hx-request']
      ? reply.header('HX-Redirect', url).status(200).send()
      : reply.redirect(url);
  });
};

export { setupErrorHandling };
