import { ForbiddenError } from '../../domain/errors/forbidden.js';
import { Roles } from '../../domain/roles.js';

class UpdateSpecialtyContentUseCase {
  #specialtiesContentRepo = null;
  #sessionsService = null;

  constructor({ specialtiesContentRepo, sessionsService }) {
    this.#specialtiesContentRepo = specialtiesContentRepo;
    this.#sessionsService = sessionsService;
  }

  async exec({ specialtyId, language, name }) {
    const user = await this.#sessionsService.getCurrentUser();
    if (!user || user.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }

    const content = await this.#specialtiesContentRepo.readByInfo({
      specialtyId,
      language,
    });
    const updatedAt = new Date().toISOString();

    if (!content) {
      const { contentId } = await this.#specialtiesContentRepo.create({
        specialtyId,
        language,
        name,
      });

      return { id: contentId, specialtyId, language, name, updatedAt };
    }

    await this.#specialtiesContentRepo.update({
      name,
      updatedAt,
      contentId: content.id,
    });

    return { ...content, name, updatedAt };
  }
}

export { UpdateSpecialtyContentUseCase };
