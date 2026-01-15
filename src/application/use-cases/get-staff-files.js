class GetStaffFilesUseCase {
  #staffFileRepo = null;

  constructor({ staffFileRepo }) {
    this.#staffFileRepo = staffFileRepo;
  }

  async exec(staffId) {
    return this.#staffFileRepo.find(staffId);
  }
}

export { GetStaffFilesUseCase };
