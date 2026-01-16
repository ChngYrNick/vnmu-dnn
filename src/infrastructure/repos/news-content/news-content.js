class NewsContentRepo {
  #db = null;
  #loader = null;

  constructor(db, loader) {
    this.#db = db;
    this.#loader = loader;
  }

  async readByInfo({ newsId, language }) {
    const query = this.#loader.get('news-content/select-by-info.sql');
    return this.#db.prepare(query).get(newsId, language);
  }

  async create({ newsId, language, title }) {
    const query = this.#loader.get('news-content/insert.sql');
    const { lastInsertRowid } = this.#db
      .prepare(query)
      .run(newsId, language, title);
    return { contentId: lastInsertRowid };
  }

  async updateTitle({ contentId, title, updatedAt }) {
    const query = this.#loader.get('news-content/update-title.sql');
    return this.#db.prepare(query).run(title, updatedAt, contentId);
  }

  async updateData({ contentId, data, updatedAt }) {
    const query = this.#loader.get('news-content/update-data.sql');
    return this.#db.prepare(query).run(data, updatedAt, contentId);
  }
}

export { NewsContentRepo };
