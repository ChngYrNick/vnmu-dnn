import { DomainError } from './errors.js';

class NotFoundError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = DomainError.NOT_FOUND;
  }
}

export { NotFoundError };
