class UserRepo {
  #loader = null;
  #db = null;

  constructor(db, loader) {
    this.#db = db;
    this.#loader = loader;
  }

  async readByInfo({ username, email }) {
    const query = this.#loader.get('user/select-by-info.sql');
    return this.#db.prepare(query).get(username, email);
  }

  async exists({ username, email }) {
    const query = this.#loader.get('user/exists.sql');
    const result = this.#db.prepare(query).get(username, email);
    return result.userExists === 1;
  }

  async read(userId) {
    const query = this.#loader.get('user/select-by-id.sql');
    return this.#db.prepare(query).get(userId);
  }

  async create({ username, email, password, roleId }) {
    const query = this.#loader.get('user/insert.sql');
    return this.#db.prepare(query).run(username, email, password, roleId);
  }

  async delete(userId) {
    const query = this.#loader.get('user/delete.sql');
    return this.#db.prepare(query).run(userId);
  }
}

export { UserRepo };
