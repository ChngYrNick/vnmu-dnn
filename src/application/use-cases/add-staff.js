class AddStaffUseCase {
  constructor({ staffRepo }) {
    this.staffRepo = staffRepo;
  }

  async exec(data) {
    return this.staffRepo.create(data);
  }
}

export { AddStaffUseCase };
