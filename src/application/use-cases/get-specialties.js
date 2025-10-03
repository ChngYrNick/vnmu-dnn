class GetSpecialtiesUseCase {
  #specialtiesRepo = null;
  constructor({ specialtiesRepo }) {
    this.#specialtiesRepo = specialtiesRepo;
  }

  async exec() {
    return this.#specialtiesRepo.find();
  }
}

export { GetSpecialtiesUseCase };