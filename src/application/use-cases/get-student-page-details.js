class GetStudentPageDetailsUseCase {
  #specialtiesRepo = null;
  #specialtiesContentRepo = null;
  #studentMaterialsRepo = null;
  #studentMaterialsContentRepo = null;
  #contactsRepo = null;

  constructor({
    specialtiesRepo,
    specialtiesContentRepo,
    studentMaterialsRepo,
    studentMaterialsContentRepo,
    contactsRepo,
  }) {
    this.#specialtiesRepo = specialtiesRepo;
    this.#specialtiesContentRepo = specialtiesContentRepo;
    this.#studentMaterialsRepo = studentMaterialsRepo;
    this.#studentMaterialsContentRepo = studentMaterialsContentRepo;
    this.#contactsRepo = contactsRepo;
  }

  async exec({ specialtyId, course, language }) {
    const [allSpecialties, contacts] = await Promise.all([
      this.#specialtiesRepo.find(),
      this.#contactsRepo.read(),
    ]);

    const specialtiesWithNames = await Promise.all(
      allSpecialties.map(async (specialty) => {
        const content = await this.#specialtiesContentRepo.readByInfo({
          specialtyId: specialty.id,
          language,
        });
        return {
          ...specialty,
          name: content?.name || specialty.slug,
        };
      }),
    );

    let courses = [];
    let content = null;

    if (specialtyId) {
      courses = await this.#studentMaterialsRepo.findBySpecialty(specialtyId);

      if (course) {
        const material = await this.#studentMaterialsRepo.findBySpecialtyAndCourse(
          specialtyId,
          course,
        );
        if (material) {
          content = await this.#studentMaterialsContentRepo.readByInfo({
            materialId: material.id,
            language,
          });
        }
      }
    }

    return {
      specialties: specialtiesWithNames,
      courses,
      content,
      contacts,
    };
  }
}

export { GetStudentPageDetailsUseCase };
