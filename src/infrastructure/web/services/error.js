import { NotFoundError } from '../../../domain/errors/not-found.js';
import { ConflictError } from '../../../domain/errors/conflict.js';
import { UnauthError } from '../../../domain/errors/unauth-error.js';
import { ForbiddenError } from '../../../domain/errors/forbidden.js';
import { BadRequestError } from '../../../domain/errors/bad-request.js';

class ErrorService {
  #languageService = null;

  constructor(languageService) {
    this.#languageService = languageService;
  }

  handle(error) {
    switch (error.constructor.name) {
      case ConflictError.name:
        return {
          code: 409,
          title: this.#languageService.translate('errors.conflict.title'),
          description: this.#languageService.translate(
            `errors.conflict.description.${error.type || 'default'}`,
          ),
        };
      case NotFoundError.name:
        return {
          code: 404,
          title: this.#languageService.translate('errors.notFound.title'),
          description: this.#languageService.translate(
            `errors.notFound.description.${error.type || 'default'}`,
          ),
        };
      case ForbiddenError.name:
        return {
          code: 403,
          title: this.#languageService.translate('errors.forbidden.title'),
          description: this.#languageService.translate(
            `errors.forbidden.description.${error.type || 'default'}`,
          ),
        };
      case UnauthError.name:
        return {
          code: 401,
          title: this.#languageService.translate('errors.unauthorized.title'),
          description: this.#languageService.translate(
            `errors.unauthorized.description.${error.type || 'default'}`,
          ),
        };
      case BadRequestError.name:
        return {
          code: 400,
          title: this.#languageService.translate('errors.badRequest.title'),
          description: this.#languageService.translate(
            `errors.badRequest.description.${error.type || 'default'}`,
          ),
        };
      default:
        return {
          code: 500,
          title: this.#languageService.translate('errors.internal.title'),
          description: this.#languageService.translate(
            'errors.internal.description.default',
          ),
        };
    }
  }
}

export { ErrorService };
