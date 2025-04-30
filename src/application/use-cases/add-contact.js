class AddContactUseCase {
  #contactsRepo = null;

  constructor({ contactsRepo }) {
    this.#contactsRepo = contactsRepo;
  }

  async exec(data) {
    return this.#contactsRepo.create(data);
  }
}

export { AddContactUseCase };
