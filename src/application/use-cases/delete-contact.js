import { ForbiddenError } from '../../domain/errors/forbidden.js';
import { Roles } from '../../domain/roles.js';

class DeleteContactUseCase {
  #contactsRepo = null;
  #sessionsService = null;

  constructor({ contactsRepo, sessionsService }) {
    this.#contactsRepo = contactsRepo;
    this.#sessionsService = sessionsService;
  }

  async exec(contactId) {
    const user = await this.#sessionsService.getCurrentUser();
    if (!user || user.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }
    return this.#contactsRepo.deleteById(contactId);
  }
}

export { DeleteContactUseCase };
