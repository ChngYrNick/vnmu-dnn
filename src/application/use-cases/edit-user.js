import { ForbiddenError } from '../../domain/errors/forbidden.js';
import { NotFoundError } from '../../domain/errors/not-found.js';
import { UnauthError } from '../../domain/errors/unauth-error.js';
import { Roles } from '../../domain/roles.js';

class EditUserUseCase {
  #userRepo = null;
  #sessionsService = null;
  #sessionsRepo = null;
  #passwordService = null;

  constructor({ userRepo, sessionsService, sessionsRepo, passwordService }) {
    this.#userRepo = userRepo;
    this.#sessionsService = sessionsService;
    this.#sessionsRepo = sessionsRepo;
    this.#passwordService = passwordService;
  }

  async exec({ userId, data }) {
    const currentUser = await this.#sessionsService.getCurrentUser();

    if (!currentUser) {
      throw new UnauthError(UnauthError.NO_SESSION);
    }

    if (currentUser.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }

    const targetUser = await this.#userRepo.read(userId);

    if (!targetUser) {
      throw new NotFoundError();
    }

    const isCurrentUser = targetUser.id === currentUser.id;

    if (isCurrentUser && data.role !== currentUser.role) {
      throw new ForbiddenError();
    }

    const newPassword = data.password
      ? await this.#passwordService.hash(data.password)
      : targetUser.password;
    const newRole = data.role || targetUser.role;
    const newFullName = data.fullName || targetUser.fullName;

    await this.#userRepo.update({
      userId: targetUser.id,
      fullName: newFullName,
      email: targetUser.email,
      password: newPassword,
      role: newRole,
    });

    if (isCurrentUser) {
      await this.#sessionsService.updateSession({
        ...targetUser,
        fullName: newFullName,
        password: newPassword,
      });
      return;
    }

    await this.#sessionsRepo.updateDataByUserId(targetUser.id, {
      ...targetUser,
      fullName: newFullName,
      role: newRole,
      password: newPassword,
    });
  }
}

export { EditUserUseCase };
