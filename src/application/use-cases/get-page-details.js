class GetPageDetailsUseCase {
  #pagesRepo = null;
  #pagesContentRepo = null;

  constructor({ pagesRepo, pagesContentRepo }) {
    this.#pagesRepo = pagesRepo;
    this.#pagesContentRepo = pagesContentRepo;
  }

  async exec({ pageId, slug, language }) {
    let page = null;

    if (pageId) {
      page = await this.#pagesRepo.readById(pageId);
    } else if (slug) {
      page = await this.#pagesRepo.readBySlug(slug);
    }

    const content = await this.#pagesContentRepo.readByInfo({
      pageId: page.id,
      language,
    });

    return { page, content };
  }
}

export { GetPageDetailsUseCase };
