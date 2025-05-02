import { ForbiddenError } from '../../domain/errors/forbidden.js';
import { Roles } from '../../domain/roles.js';

class DeleteFileUseCase {
  #filesRepo = null;
  #fileService = null;
  #sessionsService = null;

  constructor({ filesRepo, fileService, sessionsService }) {
    this.#filesRepo = filesRepo;
    this.#fileService = fileService;
    this.#sessionsService = sessionsService;
  }
  async exec(fileId) {
    const user = await this.#sessionsService.getCurrentUser();
    if (!user || user.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }
    const file = await this.#filesRepo.readById(fileId);
    await this.#fileService.delete(file.filepath);
    return this.#filesRepo.deleteById(fileId);
  }
}

export { DeleteFileUseCase };
