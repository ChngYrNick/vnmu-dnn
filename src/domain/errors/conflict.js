import { DomainError } from './errors.js';

class ConflictError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = DomainError.CONFLICT;
  }
}

export { ConflictError };
