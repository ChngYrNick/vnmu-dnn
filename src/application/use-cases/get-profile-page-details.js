import { UnauthError } from '../../domain/errors/unauth-error.js';

class GetProfilePageDetailsUseCase {
  #sessionsService = null;

  constructor({ sessionsService }) {
    this.#sessionsService = sessionsService;
  }

  async exec() {
    const user = await this.#sessionsService.getCurrentUser();
    if (!user) {
      throw new UnauthError(UnauthError.NO_SESSION);
    }
    return { user };
  }
}

export { GetProfilePageDetailsUseCase };
