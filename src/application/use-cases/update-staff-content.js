import { ForbiddenError } from '../../domain/errors/forbidden.js';
import { Roles } from '../../domain/roles.js';

class UpdateStaffContentUseCase {
  #staffContentRepo = null;
  #sessionsService = null;

  constructor({ staffContentRepo, sessionsService }) {
    this.#staffContentRepo = staffContentRepo;
    this.#sessionsService = sessionsService;
  }

  async exec({ staffId, language, name, position }) {
    const user = await this.#sessionsService.getCurrentUser();
    if (!user || user.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }

    const content = await this.#staffContentRepo.readByInfo({
      staffId,
      language,
    });
    const updatedAt = new Date().toISOString();

    if (!content) {
      const { contentId } = await this.#staffContentRepo.create({
        staffId,
        language,
        name: name || '',
        position: position || '',
      });

      return { id: contentId, staffId, language, name, position, updatedAt };
    }

    await this.#staffContentRepo.update({
      name: name || '',
      position: position || '',
      updatedAt,
      contentId: content.id,
    });

    return { ...content, name, position, updatedAt };
  }
}

export { UpdateStaffContentUseCase };
