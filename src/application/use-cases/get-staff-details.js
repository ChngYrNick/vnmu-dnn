class GetStaffDetailsUseCase {
  #staffRepo = null;
  #staffContentRepo = null;
  #staffFileRepo = null;

  constructor({ staffRepo, staffContentRepo, staffFileRepo }) {
    this.#staffRepo = staffRepo;
    this.#staffContentRepo = staffContentRepo;
    this.#staffFileRepo = staffFileRepo;
  }

  async exec({ staffId, language }) {
    const staff = await this.#staffRepo.readById(staffId);

    const [content, files] = await Promise.all([
      this.#staffContentRepo.readByInfo({ staffId, language }),
      this.#staffFileRepo.find(staffId),
    ]);

    return {
      staff: {
        ...staff,
        name: content?.name || '',
        position: content?.position || '',
      },
      content,
      profilePicture: files[0] || null,
    };
  }
}

export { GetStaffDetailsUseCase };
