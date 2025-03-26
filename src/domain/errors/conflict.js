import { DomainError } from './domain.js';

class ConflictError extends DomainError {
  static ACTIVE_SESSION = 'activeSession';

  static USER_EXISTS = 'userExists';
}

export { ConflictError };
