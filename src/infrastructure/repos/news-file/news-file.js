class NewsFileRepo {
  #loader = null;
  #db = null;
  #filesRepo = null;

  constructor(db, loader, filesRepo) {
    this.#db = db;
    this.#loader = loader;
    this.#filesRepo = filesRepo;
  }

  async create(newsId, fileDto) {
    const query = this.#loader.get('news-file/insert.sql');
    const { fileId } = await this.#filesRepo.create(fileDto);
    this.#db.prepare(query).run(fileId, newsId);
    return { fileId };
  }

  async find(newsId) {
    const query = this.#loader.get('news-file/select.sql');
    return this.#db.prepare(query).all(newsId);
  }
}

export { NewsFileRepo };
