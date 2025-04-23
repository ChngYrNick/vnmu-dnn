class FilesRepo {
  #loader = null;
  #db = null;

  constructor(db, loader) {
    this.#db = db;
    this.#loader = loader;
  }

  async create({ filename, originalFilename, mimetype, size, path, filepath }) {
    const query = this.#loader.get('files/insert.sql');
    const { lastInsertRowid } = this.#db
      .prepare(query)
      .run(filename, originalFilename, mimetype, size, path, filepath);
    return { fileId: lastInsertRowid };
  }

  async readByFilename(filename) {
    const query = this.#loader.get('files/select-by-filename.sql');
    return this.#db.prepare(query).get(filename);
  }

  async readById(id) {
    const query = this.#loader.get('files/select-by-id.sql');
    return this.#db.prepare(query).get(id);
  }

  async deleteById(id) {
    const query = this.#loader.get('files/delete-by-id.sql');
    return this.#db.prepare(query).run(id);
  }
}

export { FilesRepo };
