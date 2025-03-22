import { ConflictError } from '../../domain/errors/conflict.js';
import { Roles } from '../../domain/roles.js';

class SignUpUseCase {
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
      throw new ConflictError(ConflictError.ACTIVE_SESSION);
    }
    if (await this.#userRepo.exists({ email })) {
      throw new ConflictError(ConflictError.USER_EXISTS);
    }
    const hashedPassword = await this.#passwordService.hash(password);
    const user = {
      email,
      password: hashedPassword,
      role: Roles.USER,
    };
    await this.#userRepo.create(user);
    await this.#sessionsService.startSession(user);
  }
}

export { SignUpUseCase };
