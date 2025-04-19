class GetPageDetailsUseCase {
  #pagesRepo = null;
  #pagesContentRepo = null;

  constructor({ pagesRepo, pagesContentRepo }) {
    this.#pagesRepo = pagesRepo;
    this.#pagesContentRepo = pagesContentRepo;
  }

  async exec({ pageId, language }) {
    const page = await this.#pagesRepo.readById(pageId);

    const content = await this.#pagesContentRepo.readByInfo({
      pageId,
      language,
    });

    return { page, content };
  }
}

export { GetPageDetailsUseCase };
