class GetNewsUseCase {
  #newsRepo = null;

  constructor({ newsRepo }) {
    this.#newsRepo = newsRepo;
  }

  async exec() {
    return this.#newsRepo.find();
  }
}

export { GetNewsUseCase };
