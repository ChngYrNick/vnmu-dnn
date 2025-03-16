const setupRoutes = async (fastify) => {
  fastify.get('/', async (request, reply) => {
    return reply.view('pages/home.html');
  });

  fastify.get('/about', async (request, reply) => {
    return reply.view('pages/about.html');
  });
};

export { setupRoutes };
