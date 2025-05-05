import { UnauthError } from '../../domain/errors/unauth-error.js';
import { NotFoundError } from '../../domain/errors/not-found.js';
import { ForbiddenError } from '../../domain/errors/forbidden.js';
import { Roles } from '../../domain/roles.js';

class GetUserDetailsUseCase {
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

    if (currentUser.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }

    const user = await this.#userRepo.read(userId);

    if (!user) {
      throw new NotFoundError();
    }

    return { user };
  }
}

export { GetUserDetailsUseCase };
