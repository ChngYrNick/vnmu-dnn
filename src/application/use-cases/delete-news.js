import { ForbiddenError } from '../../domain/errors/forbidden.js';
import { Roles } from '../../domain/roles.js';

class DeleteNewsUseCase {
  #newsRepo = null;
  #sessionsService = null;

  constructor({ newsRepo, sessionsService }) {
    this.#newsRepo = newsRepo;
    this.#sessionsService = sessionsService;
  }

  async exec(newsId) {
    const user = await this.#sessionsService.getCurrentUser();
    if (!user || user.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }

    await this.#newsRepo.delete(newsId);
    return { success: true };
  }
}

export { DeleteNewsUseCase };
