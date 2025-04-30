class GetContactsUseCase {
  #contactsRepo = null;

  constructor({ contactsRepo }) {
    this.#contactsRepo = contactsRepo;
  }

  async exec() {
    return this.#contactsRepo.read();
  }
}

export { GetContactsUseCase };
