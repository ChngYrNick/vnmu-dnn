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
      throw new UnauthError("Can't sign in while active session");
    }

    const user = this.#userRepo.readByInfo({ email });

    if (!user) {
      throw new UnauthError("The user with this credentials doesn't exists");
    }

    const valid = await this.#passwordService.compare(user.password, password);

    if (!valid) {
      throw new UnauthError('Provided password is not valid');
    }

    await this.#sessionsService.startSession(user);
  }
}

export { SignInUseCase };
