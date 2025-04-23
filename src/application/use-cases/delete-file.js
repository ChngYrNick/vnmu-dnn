class DeleteFileUseCase {
  #filesRepo = null;
  #fileService = null;

  constructor({ filesRepo, fileService }) {
    this.#filesRepo = filesRepo;
    this.#fileService = fileService;
  }
  async exec(fileId) {
    const file = await this.#filesRepo.readById(fileId);
    await this.#fileService.delete(file.filepath);
    return this.#filesRepo.deleteById(fileId);
  }
}

export { DeleteFileUseCase };
