class GetStaffUseCase {
  #staffRepo = null;

  constructor({ staffRepo }) {
    this.#staffRepo = staffRepo;
  }

  async exec() {
    return this.#staffRepo.find();
  }
}

export { GetStaffUseCase };
