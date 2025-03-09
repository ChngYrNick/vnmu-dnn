const setupRoutes = async (fastify) => {
  fastify.get('/', async (request, reply) => {
    return reply.view('pages/home.html', {
      title: 'Home Page',
    });
  });

  fastify.get('/about', async (request, reply) => {
    return reply.view('pages/about.html', {
      title: 'About Page',
    });
  });
};

export { setupRoutes };
