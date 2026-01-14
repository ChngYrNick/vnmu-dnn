class GetStudentMaterialContentUseCase {
  #studentMaterialsContentRepo = null;

  constructor({ studentMaterialsContentRepo }) {
    this.#studentMaterialsContentRepo = studentMaterialsContentRepo;
  }

  async exec(materialId, language) {
    return this.#studentMaterialsContentRepo.readByInfo({
      materialId,
      language,
    });
  }
}

export { GetStudentMaterialContentUseCase };
