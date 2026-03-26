import { UnauthError } from '../../domain/errors/unauth-error.js';

class GetProfilePageDetailsUseCase {
  #sessionsService = null;
  #contactsRepo = null;

  constructor({ sessionsService, contactsRepo }) {
    this.#sessionsService = sessionsService;
    this.#contactsRepo = contactsRepo;
  }

  async exec() {
    const [user, contacts] = await Promise.all([
      this.#sessionsService.getCurrentUser(),
      this.#contactsRepo.read(),
    ]);
    if (!user) {
      throw new UnauthError(UnauthError.NO_SESSION);
    }
    return { user, contacts };
  }
}

export { GetProfilePageDetailsUseCase };
