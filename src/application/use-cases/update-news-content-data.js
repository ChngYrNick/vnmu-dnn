import { ForbiddenError } from '../../domain/errors/forbidden.js';
import { Roles } from '../../domain/roles.js';

class UpdateNewsContentDataUseCase {
  #newsContentRepo = null;
  #sessionsService = null;

  constructor({ newsContentRepo, sessionsService }) {
    this.#newsContentRepo = newsContentRepo;
    this.#sessionsService = sessionsService;
  }

  async exec({ newsId, language, data }) {
    const user = await this.#sessionsService.getCurrentUser();
    if (!user || user.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }

    const content = await this.#newsContentRepo.readByInfo({
      newsId,
      language,
    });
    const updatedAt = new Date().toISOString();

    if (!content) {
      const { contentId } = await this.#newsContentRepo.create({
        newsId,
        language,
        title: '',
      });

      await this.#newsContentRepo.updateData({
        contentId,
        data,
        updatedAt,
      });

      return { id: contentId, newsId, language, data, updatedAt };
    }

    await this.#newsContentRepo.updateData({
      contentId: content.id,
      data,
      updatedAt,
    });

    return { ...content, data, updatedAt };
  }
}

export { UpdateNewsContentDataUseCase };
