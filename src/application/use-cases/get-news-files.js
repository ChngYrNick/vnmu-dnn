class GetNewsFilesUseCase {
  #newsFileRepo = null;

  constructor({ newsFileRepo }) {
    this.#newsFileRepo = newsFileRepo;
  }

  async exec(newsId) {
    return this.#newsFileRepo.find(newsId);
  }
}

export { GetNewsFilesUseCase };
