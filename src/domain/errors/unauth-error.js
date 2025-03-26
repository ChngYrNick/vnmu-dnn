import { DomainError } from './domain.js';

class UnauthError extends DomainError {
  constructor(type, message, options) {
    super(message, options);
    this.type = type;
  }

  static ACTIVE_SESSION = 'activeSession';

  static USER_NOT_FOUND = 'userNotFound';

  static INVALID_PASSWORD = 'invalidPassword';

  static NO_SESSION = 'noSession';
}

export { UnauthError };
