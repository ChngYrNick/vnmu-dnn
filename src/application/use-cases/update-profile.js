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

  async exec({ email, fullName, password }) {
    const user = await this.#sessionsService.getCurrentUser();

    if (!user) {
      throw new UnauthError(UnauthError.ACTIVE_SESSION);
    }

    const newPassword = password
      ? await this.#passwordService.hash(password)
      : null;

    await this.#userRepo.updateInfo({
      userId: user.id,
      email,
      fullName,
      password: newPassword,
    });

    await this.#sessionsService.updateSession({
      ...user,
      email,
      fullName,
      password: newPassword || user.password,
    });
  }
}

export { UpdateProfileUseCase };
