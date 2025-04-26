class UpdatePageContentUseCase {
  #pagesContentRepo = null;

  constructor({ pagesContentRepo }) {
    this.#pagesContentRepo = pagesContentRepo;
  }

  async exec({ data, pageId, language }) {
    const content = await this.#pagesContentRepo.readByInfo({
      pageId,
      language,
    });
    const updatedAt = new Date().toISOString();

    if (!content) {
      const { pagesContentId } = await this.#pagesContentRepo.create({
        pageId,
        language,
        data,
      });

      return { id: pagesContentId, pageId, language, data, updatedAt };
    }

    await this.#pagesContentRepo.update({
      data,
      updatedAt,
      pagesContentId: content.id,
    });

    return { ...content, data, updatedAt };
  }
}

export { UpdatePageContentUseCase };
