class StudentMaterialsFileRepo {
  #loader = null;
  #db = null;
  #filesRepo = null;

  constructor(db, loader, filesRepo) {
    this.#db = db;
    this.#loader = loader;
    this.#filesRepo = filesRepo;
  }

  async create(materialId, fileDto) {
    const query = this.#loader.get('student-materials-file/insert.sql');
    const { fileId } = await this.#filesRepo.create(fileDto);
    this.#db.prepare(query).run(fileId, materialId);
    return { fileId };
  }

  async find(materialId) {
    const query = this.#loader.get('student-materials-file/select.sql');
    return this.#db.prepare(query).all(materialId);
  }
}

export { StudentMaterialsFileRepo };
