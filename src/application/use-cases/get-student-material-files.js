class GetStudentMaterialFilesUseCase {
  #studentMaterialsFileRepo = null;

  constructor({ studentMaterialsFileRepo }) {
    this.#studentMaterialsFileRepo = studentMaterialsFileRepo;
  }

  async exec(materialId) {
    return this.#studentMaterialsFileRepo.find(materialId);
  }
}

export { GetStudentMaterialFilesUseCase };
