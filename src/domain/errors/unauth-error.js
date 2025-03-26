import { DomainError } from './errors.js';

class UnauthError extends Error {
  constructor(type, message, options) {
    super(message, options);
    this.type = type;
    this.name = DomainError.UNAUTH_ERROR;
  }

  static ACTIVE_SESSION = 'activeSession';

  static USER_NOT_FOUND = 'userNotFound';

  static INVALID_PASSWORD = 'invalidPassword';

  static NO_SESSION = 'noSession';
}

export { UnauthError };
