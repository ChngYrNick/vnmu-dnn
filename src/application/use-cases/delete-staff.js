import { ForbiddenError } from '../../domain/errors/forbidden.js';
import { Roles } from '../../domain/roles.js';

class DeleteStaffUseCase {
  #staffRepo = null;
  #sessionsService = null;

  constructor({ staffRepo, sessionsService }) {
    this.#staffRepo = staffRepo;
    this.#sessionsService = sessionsService;
  }

  async exec(staffId) {
    const user = await this.#sessionsService.getCurrentUser();
    if (!user || user.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }

    await this.#staffRepo.delete(staffId);
    return { success: true };
  }
}

export { DeleteStaffUseCase };
