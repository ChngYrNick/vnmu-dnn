class NewsRepo {
  #loader = null;
  #db = null;

  constructor(db, loader) {
    this.#db = db;
    this.#loader = loader;
  }

  async find() {
    const query = this.#loader.get('news/select.sql');
    return this.#db.prepare(query).all();
  }

  async findPublishedPaginated(limit, offset) {
    const query = this.#loader.get('news/select-published-paginated.sql');
    return this.#db.prepare(query).all(limit, offset);
  }

  async countPublished() {
    const query = this.#loader.get('news/count-published.sql');
    const result = this.#db.prepare(query).get();
    return result.count;
  }

  async create({ slug }) {
    const query = this.#loader.get('news/insert.sql');
    return this.#db.prepare(query).run(slug);
  }

  async readById(id) {
    const query = this.#loader.get('news/select-by-id.sql');
    return this.#db.prepare(query).get(id);
  }

  async updatePublished({ id, published, publishedAt }) {
    const query = this.#loader.get('news/update-published.sql');
    return this.#db.prepare(query).run(published ? 1 : 0, publishedAt, id);
  }

  async delete(id) {
    const query = this.#loader.get('news/delete.sql');
    return this.#db.prepare(query).run(id);
  }
}

export { NewsRepo };
