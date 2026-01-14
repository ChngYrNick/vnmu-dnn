import { ForbiddenError } from '../../domain/errors/forbidden.js';
import { Roles } from '../../domain/roles.js';

class DeleteSpecialtyUseCase {
  #specialtiesRepo = null;
  #sessionsService = null;

  constructor({ specialtiesRepo, sessionsService }) {
    this.#specialtiesRepo = specialtiesRepo;
    this.#sessionsService = sessionsService;
  }

  async exec(specialtyId) {
    const user = await this.#sessionsService.getCurrentUser();
    if (!user || user.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }

    await this.#specialtiesRepo.delete(specialtyId);
    return { success: true };
  }
}

export { DeleteSpecialtyUseCase };
