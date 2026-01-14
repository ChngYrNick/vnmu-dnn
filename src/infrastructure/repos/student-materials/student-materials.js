class StudentMaterialsRepo {
  #db = null;
  #loader = null;

  constructor(db, loader) {
    this.#db = db;
    this.#loader = loader;
  }

  async findBySpecialty(specialtyId) {
    const query = this.#loader.get('student-materials/select-by-specialty.sql');
    return this.#db.prepare(query).all(specialtyId);
  }

  async readById(id) {
    const query = this.#loader.get('student-materials/select-by-id.sql');
    return this.#db.prepare(query).get(id);
  }

  async findBySpecialtyAndCourse(specialtyId, course) {
    const query = this.#loader.get(
      'student-materials/select-by-specialty-and-course.sql',
    );
    return this.#db.prepare(query).get(specialtyId, course);
  }

  async create({ specialtyId, course }) {
    const query = this.#loader.get('student-materials/insert.sql');
    const { lastInsertRowid } = this.#db
      .prepare(query)
      .run(specialtyId, course);
    return { materialId: lastInsertRowid };
  }

  async delete(id) {
    const query = this.#loader.get('student-materials/delete.sql');
    return this.#db.prepare(query).run(id);
  }
}

export { StudentMaterialsRepo };
