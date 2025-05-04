class UserRepo {
  #loader = null;
  #db = null;

  constructor(db, loader) {
    this.#db = db;
    this.#loader = loader;
  }

  async readByInfo({ email }) {
    const query = this.#loader.get('user/select-by-info.sql');
    return this.#db.prepare(query).get(email);
  }

  async exists({ email }) {
    const query = this.#loader.get('user/exists.sql');
    const result = this.#db.prepare(query).get(email);
    return result.userExists === 1;
  }

  async find() {
    const query = this.#loader.get('user/select.sql');
    return this.#db.prepare(query).all();
  }

  async read(userId) {
    const query = this.#loader.get('user/select-by-id.sql');
    return this.#db.prepare(query).get(userId);
  }

  async create({ email, fullName, password, role }) {
    const query = this.#loader.get('user/insert.sql');
    return this.#db.prepare(query).run(email, fullName, password, role);
  }

  async delete(userId) {
    const query = this.#loader.get('user/delete.sql');
    return this.#db.prepare(query).run(userId);
  }

  async update({ fullName, email, password, role, userId }) {
    return this.#db
      .prepare(this.#loader.get('user/update.sql'))
      .run(fullName, email, password, role, userId);
  }
}

export { UserRepo };
