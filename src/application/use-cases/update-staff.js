import { ForbiddenError } from '../../domain/errors/forbidden.js';
import { Roles } from '../../domain/roles.js';

class UpdateStaffUseCase {
  #staffRepo = null;
  #sessionsService = null;

  constructor({ staffRepo, sessionsService }) {
    this.#staffRepo = staffRepo;
    this.#sessionsService = sessionsService;
  }

  async exec({ staffId, email, phone, orderIndex }) {
    const user = await this.#sessionsService.getCurrentUser();
    if (!user || user.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }

    await this.#staffRepo.update({
      id: staffId,
      email: email || null,
      phone: phone || null,
      orderIndex: parseInt(orderIndex, 10) || 0,
    });

    return { success: true };
  }
}

export { UpdateStaffUseCase };
