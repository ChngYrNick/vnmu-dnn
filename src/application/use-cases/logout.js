import { UnauthError } from '../../domain/errors/unauth-error.js';

class LogoutUseCase {
  #sessionsService = null;

  constructor({ sessionsService }) {
    this.#sessionsService = sessionsService;
  }

  async exec() {
    if (!(await this.#sessionsService.checkAuth())) {
      throw new UnauthError(UnauthError.NO_SESSION);
    }
    return this.#sessionsService.destroySession();
  }
}

export { LogoutUseCase };
