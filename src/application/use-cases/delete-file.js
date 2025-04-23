import fs from 'node:fs/promises';

class DeleteFileUseCase {
  #filesRepo = null;

  constructor({ filesRepo }) {
    this.#filesRepo = filesRepo;
  }
  async exec(fileId) {
    const file = await this.#filesRepo.readById(fileId);
    await fs.unlink(file.filepath);
    return this.#filesRepo.deleteById(fileId);
  }
}

export { DeleteFileUseCase };
