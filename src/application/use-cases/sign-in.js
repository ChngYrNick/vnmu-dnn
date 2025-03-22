import { UnauthError } from 'src/domain/errors/unauth-error.js';

class SignInUseCase {
  #userRepo = null;
  #passwordService = null;
  #sessionsService = null;

  constructor({ userRepo, passwordService, sessionsService }) {
    this.#userRepo = userRepo;
    this.#passwordService = passwordService;
    this.#sessionsService = sessionsService;
  }

  async exec({ password, email }) {
    if (await this.#sessionsService.checkAuth()) {
      throw new UnauthError(UnauthError.ACTIVE_SESSION);
    }

    const user = this.#userRepo.readByInfo({ email });

    if (!user) {
      throw new UnauthError(UnauthError.USER_NOT_FOUND);
    }

    const valid = await this.#passwordService.compare(user.password, password);

    if (!valid) {
      throw new UnauthError(UnauthError.INVALID_PASSWORD);
    }

    await this.#sessionsService.startSession(user);
  }
}

export { SignInUseCase };
