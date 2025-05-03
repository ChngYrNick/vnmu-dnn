class GetUsersUseCase {
  #userRepo = null;

  constructor({ userRepo }) {
    this.#userRepo = userRepo;
  }

  async exec() {
    return this.#userRepo.find();
  }
}

export { GetUsersUseCase };
