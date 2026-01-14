import { ForbiddenError } from '../../domain/errors/forbidden.js';
import { Roles } from '../../domain/roles.js';

class AddStudentMaterialUseCase {
  #studentMaterialsRepo = null;
  #sessionsService = null;

  constructor({ studentMaterialsRepo, sessionsService }) {
    this.#studentMaterialsRepo = studentMaterialsRepo;
    this.#sessionsService = sessionsService;
  }

  async exec({ specialtyId, course }) {
    const user = await this.#sessionsService.getCurrentUser();
    if (!user || user.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }

    const { materialId } = await this.#studentMaterialsRepo.create({
      specialtyId,
      course,
    });

    return { id: materialId, specialtyId, course };
  }
}

export { AddStudentMaterialUseCase };
