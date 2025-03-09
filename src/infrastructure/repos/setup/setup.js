class SetupRepo {
  #loader = null;
  #db = null;

  constructor(db, loader) {
    this.#db = db;
    this.#loader = loader;
  }

  async init() {
    const sql = this.#loader.get('setup/setup.sql');
    this.#db.exec(sql);
  }
}

export { SetupRepo };
