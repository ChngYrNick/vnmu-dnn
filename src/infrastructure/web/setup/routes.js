import { PAGES } from '../plugins/view/pages.js';

const setupRoutes = async (fastify) => {
  fastify.get('/', async (request, reply) => {
    return reply.view('pages/home.html', { page: PAGES.Home });
  });

  fastify.get('/about', async (request, reply) => {
    return reply.view('pages/about.html', { page: PAGES.About });
  });
};

export { setupRoutes };
