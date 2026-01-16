class GetNewsDetailsUseCase {
  #newsRepo = null;
  #newsContentRepo = null;

  constructor({ newsRepo, newsContentRepo }) {
    this.#newsRepo = newsRepo;
    this.#newsContentRepo = newsContentRepo;
  }

  async exec({ newsId, language }) {
    const news = await this.#newsRepo.readById(newsId);
    const content = await this.#newsContentRepo.readByInfo({ newsId, language });

    return {
      news: {
        ...news,
        title: content?.title || '',
      },
      content,
    };
  }
}

export { GetNewsDetailsUseCase };
