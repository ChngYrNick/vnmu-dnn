const setupDI = async (fastify) => {
  fastify.decorateRequest('di');
  fastify.addHook('onRequest', (req, reply, done) => {
    req.di = new Map();
    done();
  });
};

export { setupDI };
