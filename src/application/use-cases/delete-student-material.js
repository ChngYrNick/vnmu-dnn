import { ForbiddenError } from '../../domain/errors/forbidden.js';
import { Roles } from '../../domain/roles.js';

class DeleteStudentMaterialUseCase {
  #studentMaterialsRepo = null;
  #sessionsService = null;

  constructor({ studentMaterialsRepo, sessionsService }) {
    this.#studentMaterialsRepo = studentMaterialsRepo;
    this.#sessionsService = sessionsService;
  }

  async exec(materialId) {
    const user = await this.#sessionsService.getCurrentUser();
    if (!user || user.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }

    await this.#studentMaterialsRepo.delete(materialId);
    return { success: true };
  }
}

export { DeleteStudentMaterialUseCase };
