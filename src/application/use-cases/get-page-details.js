class GetPageDetailsUseCase {
  #pagesRepo = null;
  #pagesContentRepo = null;
  #contactsRepo = null;

  constructor({ pagesRepo, pagesContentRepo, contactsRepo }) {
    this.#pagesRepo = pagesRepo;
    this.#pagesContentRepo = pagesContentRepo;
    this.#contactsRepo = contactsRepo;
  }

  async exec({ pageId, slug, language }) {
    let page = null;

    if (pageId) {
      page = await this.#pagesRepo.readById(pageId);
    } else if (slug) {
      page = await this.#pagesRepo.readBySlug(slug);
    }

    const [content, contacts] = await Promise.all([
      this.#pagesContentRepo.readByInfo({
        pageId: page.id,
        language,
      }),
      this.#contactsRepo.read(),
    ]);

    return { page, content, contacts };
  }
}

export { GetPageDetailsUseCase };
