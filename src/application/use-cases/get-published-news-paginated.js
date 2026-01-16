class GetPublishedNewsPaginatedUseCase {
  #newsRepo = null;
  #newsContentRepo = null;
  #contactsRepo = null;

  constructor({ newsRepo, newsContentRepo, contactsRepo }) {
    this.#newsRepo = newsRepo;
    this.#newsContentRepo = newsContentRepo;
    this.#contactsRepo = contactsRepo;
  }

  async exec({ page, limit, language }) {
    const offset = (page - 1) * limit;
    const [newsList, totalCount, contacts] = await Promise.all([
      this.#newsRepo.findPublishedPaginated(limit, offset),
      this.#newsRepo.countPublished(),
      this.#contactsRepo.read(),
    ]);

    const newsWithContent = await Promise.all(
      newsList.map(async (news) => {
        const content = await this.#newsContentRepo.readByInfo({
          newsId: news.id,
          language,
        });
        return {
          ...news,
          title: content?.title || '',
          data: content?.data || '',
        };
      })
    );

    const totalPages = Math.ceil(totalCount / limit);

    return {
      news: newsWithContent,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      contacts,
    };
  }
}

export { GetPublishedNewsPaginatedUseCase };
