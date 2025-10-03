class SpecialtiesContentRepo {
  #db = null;
  #loader = null;

  constructor(db, loader) {
    this.#db = db;
    this.#loader = loader;
  }
}

export { SpecialtiesContentRepo };
