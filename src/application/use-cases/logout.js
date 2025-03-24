import { ConflictError } from '../../domain/errors/conflict.js';

class LogoutUseCase {
  #sessionsService = null;

  constructor({ sessionsService }) {
    this.#sessionsService = sessionsService;
  }

  async exec() {
    if (!(await this.#sessionsService.checkAuth())) {
      throw new ConflictError(ConflictError.NO_SESSION);
    }
    return this.#sessionsService.destroySession();
  }
}

export { LogoutUseCase };
