class PagesContentRepo {
  #loader = null;
  #db = null;

  constructor(db, loader) {
    this.#db = db;
    this.#loader = loader;
  }

  async update({ data, updatedAt, pagesContentId }) {
    const query = this.#loader.get('pages-content/update.sql');
    return this.#db.prepare(query).run(data, updatedAt, pagesContentId);
  }

  async create({ pageId, language, data }) {
    const query = this.#loader.get('pages-content/insert.sql');
    const { lastInsertRowid } = this.#db
      .prepare(query)
      .run(pageId, language, data);
    return { pagesContentId: lastInsertRowid };
  }

  async readByInfo({ pageId, language }) {
    const query = this.#loader.get('pages-content/select-by-info.sql');
    return this.#db.prepare(query).get(pageId, language);
  }
}

export { PagesContentRepo };
