import { ForbiddenError } from '../../domain/errors/forbidden.js';
import { Roles } from '../../domain/roles.js';

class ToggleStaffPublishedUseCase {
  #staffRepo = null;
  #sessionsService = null;

  constructor({ staffRepo, sessionsService }) {
    this.#staffRepo = staffRepo;
    this.#sessionsService = sessionsService;
  }

  async exec({ staffId, published }) {
    const user = await this.#sessionsService.getCurrentUser();
    if (!user || user.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }

    await this.#staffRepo.updatePublished({
      id: staffId,
      published,
    });

    return { success: true };
  }
}

export { ToggleStaffPublishedUseCase };
