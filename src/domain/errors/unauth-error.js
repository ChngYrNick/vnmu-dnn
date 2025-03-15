import { DomainError } from './errors.js';

class UnauthError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = DomainError.UNAUTH_ERROR;
  }
}

export { UnauthError };
