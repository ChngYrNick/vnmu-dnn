import { UnauthError } from '../../domain/errors/unauth-error.js';

class UpdateProfileUseCase {
  #userRepo = null;
  #sessionsService = null;
  #passwordService = null;

  constructor({ userRepo, sessionsService, passwordService }) {
    this.#userRepo = userRepo;
    this.#sessionsService = sessionsService;
    this.#passwordService = passwordService;
  }

  async exec({ fullName, password }) {
    const user = await this.#sessionsService.getCurrentUser();

    if (!user) {
      throw new UnauthError(UnauthError.NO_SESSION);
    }

    const newPassword = password
      ? await this.#passwordService.hash(password)
      : user.password;

    const newFullName = fullName || user.fullName;

    await this.#userRepo.update({
      userId: user.id,
      fullName: newFullName,
      email: user.email,
      password: newPassword,
      role: user.role,
    });

    await this.#sessionsService.updateSession({
      ...user,
      fullName: newFullName,
      password: newPassword,
    });
  }
}

export { UpdateProfileUseCase };
