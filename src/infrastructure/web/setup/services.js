import { AuthService } from '../services/auth.js';

const setupServices = async (fastify) => {
  fastify.addHook('preHandler', (req, reply, done) => {
    req.di.set('authService', new AuthService(req));
    done();
  });
};

export { setupServices };
