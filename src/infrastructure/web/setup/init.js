const init = async (fastify) => {
  const { queryLoaderService, setupRepo } = fastify.di;
  await queryLoaderService.init();
  if (fastify.initDB) {
    await setupRepo.exec();
  }
};

export { init };
