class GetStaffPageDetailsUseCase {
  #staffRepo = null;
  #staffContentRepo = null;
  #staffFileRepo = null;
  #contactsRepo = null;

  constructor({ staffRepo, staffContentRepo, staffFileRepo, contactsRepo }) {
    this.#staffRepo = staffRepo;
    this.#staffContentRepo = staffContentRepo;
    this.#staffFileRepo = staffFileRepo;
    this.#contactsRepo = contactsRepo;
  }

  async exec({ language }) {
    const [staffList, contacts] = await Promise.all([
      this.#staffRepo.findPublished(),
      this.#contactsRepo.read(),
    ]);

    const staffWithDetails = await Promise.all(
      staffList.map(async (staff) => {
        const [content, files] = await Promise.all([
          this.#staffContentRepo.readByInfo({
            staffId: staff.id,
            language,
          }),
          this.#staffFileRepo.find(staff.id),
        ]);

        return {
          ...staff,
          name: content?.name || '',
          position: content?.position || '',
          data: content?.data || '',
          profilePicture: files[0] || null,
        };
      }),
    );

    return { staff: staffWithDetails, contacts };
  }
}

export { GetStaffPageDetailsUseCase };
