class StaffFileRepo {
  #loader = null;
  #db = null;
  #filesRepo = null;

  constructor(db, loader, filesRepo) {
    this.#db = db;
    this.#loader = loader;
    this.#filesRepo = filesRepo;
  }

  async create(staffId, fileDto) {
    const query = this.#loader.get('staff-file/insert.sql');
    const { fileId } = await this.#filesRepo.create(fileDto);
    this.#db.prepare(query).run(fileId, staffId);
    return { fileId };
  }

  async find(staffId) {
    const query = this.#loader.get('staff-file/select.sql');
    return this.#db.prepare(query).all(staffId);
  }

  async deleteByStaffId(staffId) {
    const query = this.#loader.get('staff-file/delete-by-staff-id.sql');
    return this.#db.prepare(query).run(staffId);
  }
}

export { StaffFileRepo };
