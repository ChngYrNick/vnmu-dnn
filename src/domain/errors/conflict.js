import { DomainError } from './domain.js';

class ConflictError extends DomainError {
  constructor(type, message, options) {
    super(message, options);
    this.type = type;
  }

  static ACTIVE_SESSION = 'activeSession';

  static USER_EXISTS = 'userExists';
}

export { ConflictError };
