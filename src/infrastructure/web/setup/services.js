import { AuthService } from '../services/auth.js';
import { RolesService } from '../services/roles.js';

const setupServices = async (fastify) => {
  fastify.addHook('preHandler', (req, reply, done) => {
    req.di.set('authService', new AuthService(req));
    req.di.set('rolesService', new RolesService());
    done();
  });
};

export { setupServices };
