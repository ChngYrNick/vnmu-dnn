class RolesRepo {
  #loader = null;
  #db = null;

  constructor(db, loader) {
    this.#db = db;
    this.#loader = loader;
  }

  async find() {
    const query = this.#loader.get('roles/select.sql');
    return this.#db.prepare(query).all();
  }

  async read(roleId) {
    const query = this.#loader.get('roles/select-by-id.sql');
    return this.#db.prepare(query).all(roleId);
  }
}

export { RolesRepo };
