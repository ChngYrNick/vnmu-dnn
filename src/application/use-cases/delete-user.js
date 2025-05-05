import { ForbiddenError } from '../../domain/errors/forbidden.js';
import { UnauthError } from '../../domain/errors/unauth-error.js';
import { Roles } from '../../domain/roles.js';

class DeleteUserUseCase {
  #userRepo = null;
  #sessionsService = null;

  constructor({ userRepo, sessionsService }) {
    this.#userRepo = userRepo;
    this.#sessionsService = sessionsService;
  }

  async exec(userId) {
    const currentUser = await this.#sessionsService.getCurrentUser();

    if (!currentUser) {
      throw new UnauthError(UnauthError.NO_SESSION);
    }

    if (currentUser.role !== Roles.ADMIN || currentUser.id === userId) {
      throw new ForbiddenError();
    }

    await this.#userRepo.delete(userId);
  }
}

export { DeleteUserUseCase };
