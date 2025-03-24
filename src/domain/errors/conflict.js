import { DomainError } from './errors.js';

class ConflictError extends Error {
  constructor(type, message, options) {
    super(message, options);
    this.type = type;
    this.name = DomainError.CONFLICT;
  }

  static ACTIVE_SESSION = 'activeSession';

  static NO_SESSION = 'noSession';

  static USER_EXISTS = 'userExists';
}

export { ConflictError };
