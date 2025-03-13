import { ConflictError } from '../../domain/errors/conflict.js';
import { Roles } from '../../domain/roles.js';

class SignUpUseCase {
  #userRepo = null;
  #passwordService = null;

  constructor({ userRepo, passwordService }) {
    this.#userRepo = userRepo;
    this.#passwordService = passwordService;
  }

  async exec({ username, password, email }) {
    if (await this.#userRepo.exists({ username, email })) {
      throw new ConflictError(
        'A user with this username or email already exists',
      );
    }
    const hashedPassword = await this.#passwordService.hash(password);
    await this.#userRepo.create({
      username,
      email,
      password: hashedPassword,
      roleId: Roles.USER,
    });
  }
}

export { SignUpUseCase };
