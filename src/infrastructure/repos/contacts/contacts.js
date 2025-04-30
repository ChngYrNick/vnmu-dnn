class ContactsRepo {
  #loader = null;
  #db = null;

  constructor(db, loader) {
    this.#db = db;
    this.#loader = loader;
  }

  async read() {
    const query = this.#loader.get('contacts/select.sql');
    return this.#db.prepare(query).all();
  }

  async deleteById(contactId) {
    const query = this.#loader.get('contacts/delete-by-id.sql');
    return this.#db.prepare(query).run(contactId);
  }

  async create({ type, value }) {
    const query = this.#loader.get('contacts/insert.sql');
    return this.#db.prepare(query).run(type, value);
  }
}

export { ContactsRepo };
