class CreateNewsUseCase {
  constructor({ newsRepo }) {
    this.newsRepo = newsRepo;
  }

  async exec(data) {
    return this.newsRepo.create(data);
  }
}

export { CreateNewsUseCase };
