import { DI } from '../di/di.js';
import { REQ_DI } from '../di/request.js';

const setupDI = async (fastify) => {
  fastify.decorate('di', { ...DI });
  fastify.decorateRequest('di');
  fastify.addHook('onRequest', (req, reply, done) => {
    req.di = { ...REQ_DI };
    done();
  });
};

export { setupDI };
