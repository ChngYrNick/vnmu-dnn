class DeleteContactUseCase {
  #contactsRepo;

  constructor({ contactsRepo }) {
    this.#contactsRepo = contactsRepo;
  }

  async exec(contactId) {
    return this.#contactsRepo.deleteById(contactId);
  }
}

export { DeleteContactUseCase };
