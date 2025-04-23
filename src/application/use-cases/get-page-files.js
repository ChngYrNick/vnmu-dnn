class GetPageFilesUseCase {
  #pagesFileRepo = null;

  constructor({ pagesFileRepo }) {
    this.#pagesFileRepo = pagesFileRepo;
  }
  async exec(pageId) {
    return this.#pagesFileRepo.find(pageId);
  }
}

export { GetPageFilesUseCase };
