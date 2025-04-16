class GetPagesUseCase {
  #pagesRepo = null;

  constructor({ pagesRepo }) {
    this.#pagesRepo = pagesRepo;
  }

  async exec() {
    return this.#pagesRepo.read();
  }
}

export { GetPagesUseCase };
