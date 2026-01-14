class SpecialtiesContentRepo {
  #db = null;
  #loader = null;

  constructor(db, loader) {
    this.#db = db;
    this.#loader = loader;
  }

  async readByInfo({ specialtyId, language }) {
    const query = this.#loader.get('specialties-content/select-by-info.sql');
    return this.#db.prepare(query).get(specialtyId, language);
  }

  async create({ specialtyId, language, name }) {
    const query = this.#loader.get('specialties-content/insert.sql');
    const { lastInsertRowid } = this.#db
      .prepare(query)
      .run(specialtyId, language, name);
    return { contentId: lastInsertRowid };
  }

  async update({ name, updatedAt, contentId }) {
    const query = this.#loader.get('specialties-content/update.sql');
    return this.#db.prepare(query).run(name, updatedAt, contentId);
  }
}

export { SpecialtiesContentRepo };
