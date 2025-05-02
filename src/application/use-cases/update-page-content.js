import { ForbiddenError } from '../../domain/errors/forbidden.js';
import { Roles } from '../../domain/roles.js';

class UpdatePageContentUseCase {
  #pagesContentRepo = null;
  #sessionsService = null;

  constructor({ pagesContentRepo, sessionsService }) {
    this.#pagesContentRepo = pagesContentRepo;
    this.#sessionsService = sessionsService;
  }

  async exec({ data, pageId, language }) {
    const user = await this.#sessionsService.getCurrentUser();
    if (!user || user.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }
    const content = await this.#pagesContentRepo.readByInfo({
      pageId,
      language,
    });
    const updatedAt = new Date().toISOString();

    if (!content) {
      const { pagesContentId } = await this.#pagesContentRepo.create({
        pageId,
        language,
        data,
      });

      return { id: pagesContentId, pageId, language, data, updatedAt };
    }

    await this.#pagesContentRepo.update({
      data,
      updatedAt,
      pagesContentId: content.id,
    });

    return { ...content, data, updatedAt };
  }
}

export { UpdatePageContentUseCase };
