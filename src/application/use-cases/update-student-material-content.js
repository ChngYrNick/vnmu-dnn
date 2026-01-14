import { ForbiddenError } from '../../domain/errors/forbidden.js';
import { Roles } from '../../domain/roles.js';

class UpdateStudentMaterialContentUseCase {
  #studentMaterialsContentRepo = null;
  #sessionsService = null;

  constructor({ studentMaterialsContentRepo, sessionsService }) {
    this.#studentMaterialsContentRepo = studentMaterialsContentRepo;
    this.#sessionsService = sessionsService;
  }

  async exec({ materialId, language, data }) {
    const user = await this.#sessionsService.getCurrentUser();
    if (!user || user.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }

    const content = await this.#studentMaterialsContentRepo.readByInfo({
      materialId,
      language,
    });
    const updatedAt = new Date().toISOString();

    if (!content) {
      const { contentId } = await this.#studentMaterialsContentRepo.create({
        materialId,
        language,
        data,
      });

      return { id: contentId, materialId, language, data, updatedAt };
    }

    await this.#studentMaterialsContentRepo.update({
      data,
      updatedAt,
      contentId: content.id,
    });

    return { ...content, data, updatedAt };
  }
}

export { UpdateStudentMaterialContentUseCase };
