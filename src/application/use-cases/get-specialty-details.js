class GetSpecialtyDetailsUseCase {
  #specialtiesRepo = null;
  #specialtiesContentRepo = null;
  #studentMaterialsRepo = null;

  constructor({
    specialtiesRepo,
    specialtiesContentRepo,
    studentMaterialsRepo,
  }) {
    this.#specialtiesRepo = specialtiesRepo;
    this.#specialtiesContentRepo = specialtiesContentRepo;
    this.#studentMaterialsRepo = studentMaterialsRepo;
  }

  async exec({ specialtyId, language }) {
    const specialty = await this.#specialtiesRepo.readById(specialtyId);

    const [content, materials] = await Promise.all([
      this.#specialtiesContentRepo.readByInfo({
        specialtyId,
        language,
      }),
      this.#studentMaterialsRepo.findBySpecialty(specialtyId),
    ]);

    return {
      specialty: {
        ...specialty,
        name: content?.name || '',
      },
      content,
      materials,
    };
  }
}

export { GetSpecialtyDetailsUseCase };
