class PagesFileRepo {
  #loader = null;
  #db = null;
  #filesRepo = null;

  constructor(db, loader, filesRepo) {
    this.#db = db;
    this.#loader = loader;
    this.#filesRepo = filesRepo;
  }

  async create(pageId, fileDto) {
    const query = this.#loader.get('pages-file/insert.sql');
    const { fileId } = await this.#filesRepo.create(fileDto);
    this.#db.prepare(query).run(fileId, pageId);
    return { fileId };
  }

  async find(pageId) {
    const query = this.#loader.get('pages-file/select.sql');
    return this.#db.prepare(query).all(pageId);
  }
}

export { PagesFileRepo };
