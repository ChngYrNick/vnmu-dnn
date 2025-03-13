import { Errors } from './base.js';

class ConflictError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = Errors.CONFLICT;
  }
}

export { ConflictError };
