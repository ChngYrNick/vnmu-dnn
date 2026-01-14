class StudentMaterialsContentRepo {
  #db = null;
  #loader = null;

  constructor(db, loader) {
    this.#db = db;
    this.#loader = loader;
  }

  async readByInfo({ materialId, language }) {
    const query = this.#loader.get(
      'student-materials-content/select-by-info.sql',
    );
    return this.#db.prepare(query).get(materialId, language);
  }

  async create({ materialId, language, data }) {
    const query = this.#loader.get('student-materials-content/insert.sql');
    const { lastInsertRowid } = this.#db
      .prepare(query)
      .run(materialId, language, data);
    return { contentId: lastInsertRowid };
  }

  async update({ data, updatedAt, contentId }) {
    const query = this.#loader.get('student-materials-content/update.sql');
    return this.#db.prepare(query).run(data, updatedAt, contentId);
  }
}

export { StudentMaterialsContentRepo };
