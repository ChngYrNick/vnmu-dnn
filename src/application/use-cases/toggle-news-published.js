import { ForbiddenError } from '../../domain/errors/forbidden.js';
import { Roles } from '../../domain/roles.js';

class ToggleNewsPublishedUseCase {
  #newsRepo = null;
  #sessionsService = null;

  constructor({ newsRepo, sessionsService }) {
    this.#newsRepo = newsRepo;
    this.#sessionsService = sessionsService;
  }

  async exec({ newsId, published }) {
    const user = await this.#sessionsService.getCurrentUser();
    if (!user || user.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }

    const publishedAt = published ? new Date().toISOString() : null;

    await this.#newsRepo.updatePublished({
      id: newsId,
      published,
      publishedAt,
    });

    return { success: true };
  }
}

export { ToggleNewsPublishedUseCase };
