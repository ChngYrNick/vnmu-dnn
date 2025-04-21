class FilesRepo {
  #loader = null;
  #db = null;

  constructor(db, loader) {
    this.#db = db;
    this.#loader = loader;
  }

  async create({ filename, originalFilename, mimetype, size, path }) {
    const query = this.#loader.get('files/insert.sql');
    const { lastInsertRowid } = this.#db
      .prepare(query)
      .run(filename, originalFilename, mimetype, size, path);
    return { fileId: lastInsertRowid };
  }

  async readByFilename(filename) {
    const query = this.#loader.get('files/select-by-filename.sql');
    return this.#db.prepare(query).get(filename);
  }
}

export { FilesRepo };
