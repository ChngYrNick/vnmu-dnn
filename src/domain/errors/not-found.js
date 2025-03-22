import { DomainError } from './errors.js';

class NotFoundError extends Error {
  constructor(type, message, options) {
    super(message, options);
    this.type = type;
    this.name = DomainError.NOT_FOUND;
  }
}

export { NotFoundError };
