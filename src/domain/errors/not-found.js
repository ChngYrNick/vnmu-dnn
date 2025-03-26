import { DomainError } from './domain.js';

class NotFoundError extends DomainError {
  constructor(type, message, options) {
    super(message, options);
    this.type = type;
  }
}

export { NotFoundError };
