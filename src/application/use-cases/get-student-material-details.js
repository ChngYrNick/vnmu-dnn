class GetStudentMaterialDetailsUseCase {
  #studentMaterialsRepo = null;
  #studentMaterialsContentRepo = null;
  #specialtiesRepo = null;

  constructor({
    studentMaterialsRepo,
    studentMaterialsContentRepo,
    specialtiesRepo,
  }) {
    this.#studentMaterialsRepo = studentMaterialsRepo;
    this.#studentMaterialsContentRepo = studentMaterialsContentRepo;
    this.#specialtiesRepo = specialtiesRepo;
  }

  async exec({ materialId, language }) {
    const material = await this.#studentMaterialsRepo.readById(materialId);

    const [content, specialty] = await Promise.all([
      this.#studentMaterialsContentRepo.readByInfo({
        materialId,
        language,
      }),
      this.#specialtiesRepo.readById(material.specialtyId),
    ]);

    return { material, content, specialty };
  }
}

export { GetStudentMaterialDetailsUseCase };
