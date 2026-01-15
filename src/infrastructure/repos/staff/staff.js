class StaffRepo {
  #loader = null;
  #db = null;

  constructor(db, loader) {
    this.#db = db;
    this.#loader = loader;
  }

  async find() {
    const query = this.#loader.get('staff/select.sql');
    return this.#db.prepare(query).all();
  }

  async findPublished() {
    const query = this.#loader.get('staff/select-published.sql');
    return this.#db.prepare(query).all();
  }

  async create({ slug }) {
    const query = this.#loader.get('staff/insert.sql');
    return this.#db.prepare(query).run(slug);
  }

  async readById(id) {
    const query = this.#loader.get('staff/select-by-id.sql');
    return this.#db.prepare(query).get(id);
  }

  async update({ id, email, phone, orderIndex }) {
    const query = this.#loader.get('staff/update.sql');
    return this.#db.prepare(query).run(email, phone, orderIndex, id);
  }

  async updatePublished({ id, published }) {
    const query = this.#loader.get('staff/update-published.sql');
    return this.#db.prepare(query).run(published ? 1 : 0, id);
  }

  async delete(id) {
    const query = this.#loader.get('staff/delete.sql');
    return this.#db.prepare(query).run(id);
  }
}

export { StaffRepo };
