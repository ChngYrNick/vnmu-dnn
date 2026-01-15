class GetStaffContentUseCase {
  #staffContentRepo = null;

  constructor({ staffContentRepo }) {
    this.#staffContentRepo = staffContentRepo;
  }

  async exec(staffId, language) {
    return this.#staffContentRepo.readByInfo({ staffId, language });
  }
}

export { GetStaffContentUseCase };
