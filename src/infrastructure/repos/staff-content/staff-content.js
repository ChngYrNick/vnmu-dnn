class StaffContentRepo {
  #db = null;
  #loader = null;

  constructor(db, loader) {
    this.#db = db;
    this.#loader = loader;
  }

  async readByInfo({ staffId, language }) {
    const query = this.#loader.get('staff-content/select-by-info.sql');
    return this.#db.prepare(query).get(staffId, language);
  }

  async create({ staffId, language, name, position }) {
    const query = this.#loader.get('staff-content/insert.sql');
    const { lastInsertRowid } = this.#db
      .prepare(query)
      .run(staffId, language, name, position);
    return { contentId: lastInsertRowid };
  }

  async update({ contentId, name, position, updatedAt }) {
    const query = this.#loader.get('staff-content/update.sql');
    return this.#db.prepare(query).run(name, position, updatedAt, contentId);
  }

  async updateData({ contentId, data, updatedAt }) {
    const query = this.#loader.get('staff-content/update-data.sql');
    return this.#db.prepare(query).run(data, updatedAt, contentId);
  }
}

export { StaffContentRepo };
