class SetupRepo {
  #loader = null;
  #db = null;

  constructor(db, loader) {
    this.#db = db;
    this.#loader = loader;
  }

  async exec() {
    const schema = this.#loader.get('setup/schema.sql');
    const data = this.#loader.get('setup/data.sql');
    this.#db.exec(schema);
    this.#db.exec(data);
  }
}

export { SetupRepo };
