class GetHomePageDetailsUseCase {
  #contactsRepo = null;
  #newsRepo = null;
  #newsContentRepo = null;
  #newsFileRepo = null;

  constructor({ contactsRepo, newsRepo, newsContentRepo, newsFileRepo }) {
    this.#contactsRepo = contactsRepo;
    this.#newsRepo = newsRepo;
    this.#newsContentRepo = newsContentRepo;
    this.#newsFileRepo = newsFileRepo;
  }

  async exec({ language }) {
    const [contacts, newsList] = await Promise.all([
      this.#contactsRepo.read(),
      this.#newsRepo.findPublishedPaginated(3, 0),
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

    return { contacts, news: newsWithContent };
  }
}

export { GetHomePageDetailsUseCase };
