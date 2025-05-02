import { ForbiddenError } from '../../domain/errors/forbidden.js';
import { Roles } from '../../domain/roles.js';

class AddContactUseCase {
  #contactsRepo = null;
  #sessionsService = null;

  constructor({ contactsRepo, sessionsService }) {
    this.#contactsRepo = contactsRepo;
    this.#sessionsService = sessionsService;
  }

  async exec(data) {
    const user = await this.#sessionsService.getCurrentUser();
    if (!user || user.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }
    return this.#contactsRepo.create(data);
  }
}

export { AddContactUseCase };
