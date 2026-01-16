import { ForbiddenError } from '../../domain/errors/forbidden.js';
import { Roles } from '../../domain/roles.js';

class UpdateNewsTitleUseCase {
  #newsContentRepo = null;
  #sessionsService = null;

  constructor({ newsContentRepo, sessionsService }) {
    this.#newsContentRepo = newsContentRepo;
    this.#sessionsService = sessionsService;
  }

  async exec({ newsId, language, title }) {
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
        title: title || '',
      });

      return { id: contentId, newsId, language, title, updatedAt };
    }

    await this.#newsContentRepo.updateTitle({
      title: title || '',
      updatedAt,
      contentId: content.id,
    });

    return { ...content, title, updatedAt };
  }
}

export { UpdateNewsTitleUseCase };
