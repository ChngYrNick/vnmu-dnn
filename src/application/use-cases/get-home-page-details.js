class GetHomePageDetailsUseCase {
  #contactsRepo = null;
  #newsRepo = null;
  #newsContentRepo = null;
  #newsFileRepo = null;
  #specialtiesRepo = null;
  #specialtiesContentRepo = null;
  #studentMaterialsRepo = null;

  constructor({
    contactsRepo,
    newsRepo,
    newsContentRepo,
    newsFileRepo,
    specialtiesRepo,
    specialtiesContentRepo,
    studentMaterialsRepo,
  }) {
    this.#contactsRepo = contactsRepo;
    this.#newsRepo = newsRepo;
    this.#newsContentRepo = newsContentRepo;
    this.#newsFileRepo = newsFileRepo;
    this.#specialtiesRepo = specialtiesRepo;
    this.#specialtiesContentRepo = specialtiesContentRepo;
    this.#studentMaterialsRepo = studentMaterialsRepo;
  }

  async exec({ language }) {
    const [contacts, newsList, quickLinks] = await Promise.all([
      this.#contactsRepo.read(),
      this.#newsRepo.findPublishedPaginated(3, 0),
      this.#getSpecialtyQuickLinks(language),
    ]);

    const newsWithContent = await Promise.all(
      newsList.map(async (news) => {
        const [content, files] = await Promise.all([
          this.#newsContentRepo.readByInfo({
            newsId: news.id,
            language,
          }),
          this.#newsFileRepo.find(news.id),
        ]);

        const featuredImage = files.find((f) =>
          f.mimetype?.startsWith('image/'),
        );

        return {
          ...news,
          title: content?.title || '',
          data: content?.data || '',
          featuredImage: featuredImage?.path || null,
        };
      }),
    );

    return { contacts, news: newsWithContent, quickLinks };
  }

  async #getSpecialtyQuickLinks(language) {
    const allSpecialties = await this.#specialtiesRepo.find();
    const limitedSpecialties = allSpecialties.slice(0, 6);

    const quickLinks = await Promise.all(
      limitedSpecialties.map(async (specialty) => {
        const [content, courses] = await Promise.all([
          this.#specialtiesContentRepo.readByInfo({
            specialtyId: specialty.id,
            language,
          }),
          this.#studentMaterialsRepo.findBySpecialty(specialty.id),
        ]);

        // courses are ordered by course number (ascending)
        const firstCourse = courses[0]?.course;
        let url = `/student?specialty=${specialty.slug}`;
        if (firstCourse) {
          url += `&course=${firstCourse}`;
        }

        return { name: content?.name || specialty.slug, url };
      }),
    );

    return quickLinks;
  }
}

export { GetHomePageDetailsUseCase };
