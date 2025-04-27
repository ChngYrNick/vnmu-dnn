class PagesRepo {
  #loader = null;
  #db = null;

  constructor(db, loader) {
    this.#db = db;
    this.#loader = loader;
  }

  async read() {
    const query = this.#loader.get('pages/select.sql');
    return this.#db.prepare(query).all();
  }

  async readById(pageId) {
    const query = this.#loader.get('pages/select-by-id.sql');
    return this.#db.prepare(query).get(pageId);
  }

  async readBySlug(slug) {
    const query = this.#loader.get('pages/select-by-slug.sql');
    return this.#db.prepare(query).get(slug);
  }
}

export { PagesRepo };
