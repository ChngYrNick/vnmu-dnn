class GetHomePageDetailsUseCase {
  #contactsRepo = null;

  constructor({ contactsRepo }) {
    this.#contactsRepo = contactsRepo;
  }

  async exec() {
    const contacts = await this.#contactsRepo.read();
    return { contacts };
  }
}

export { GetHomePageDetailsUseCase };
