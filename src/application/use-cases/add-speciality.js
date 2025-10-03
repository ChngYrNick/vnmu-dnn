class AddSpecialityUseCase {
  constructor({ specialtiesRepo }) {
    this.specialtiesRepo = specialtiesRepo;
  }

  async exec(data) {
    return this.specialtiesRepo.create(data);
  }
}

export { AddSpecialityUseCase };
