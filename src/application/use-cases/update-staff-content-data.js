import { ForbiddenError } from '../../domain/errors/forbidden.js';
import { Roles } from '../../domain/roles.js';

class UpdateStaffContentDataUseCase {
  #staffContentRepo = null;
  #sessionsService = null;

  constructor({ staffContentRepo, sessionsService }) {
    this.#staffContentRepo = staffContentRepo;
    this.#sessionsService = sessionsService;
  }

  async exec({ staffId, language, data }) {
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
        name: '',
        position: '',
      });

      await this.#staffContentRepo.updateData({
        contentId,
        data,
        updatedAt,
      });

      return { id: contentId, staffId, language, data, updatedAt };
    }

    await this.#staffContentRepo.updateData({
      contentId: content.id,
      data,
      updatedAt,
    });

    return { ...content, data, updatedAt };
  }
}

export { UpdateStaffContentDataUseCase };
