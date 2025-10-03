class SpecialtiesRepo {
  #loader = null;
  #db = null;

  constructor(db, loader) {
    this.#db = db;
    this.#loader = loader;
  }

  async find() {
    const query = this.#loader.get('specialties/select.sql');
    return this.#db.prepare(query).all();
  }

  async create({ slug }) {
    const query = this.#loader.get('specialties/insert.sql');
    return this.#db.prepare(query).run(slug);
  }
}

export { SpecialtiesRepo };
