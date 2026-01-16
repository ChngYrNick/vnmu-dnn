import { DomainError } from './domain.js';

class BadRequestError extends DomainError {
  static FILE_SIZE_LIMIT = 'fileSizeLimit';
}

export { BadRequestError };
