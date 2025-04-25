class GetPageContentUseCase {
  #pagesContentRepo = null;

  constructor({ pagesContentRepo }) {
    this.#pagesContentRepo = pagesContentRepo;
  }

  async exec(pageId, language) {
    return this.#pagesContentRepo.readByInfo({ pageId, language });
  }
}

export { GetPageContentUseCase };
