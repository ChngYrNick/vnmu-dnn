class GetNewsContentUseCase {
  #newsContentRepo = null;

  constructor({ newsContentRepo }) {
    this.#newsContentRepo = newsContentRepo;
  }

  async exec(newsId, language) {
    return this.#newsContentRepo.readByInfo({ newsId, language });
  }
}

export { GetNewsContentUseCase };
