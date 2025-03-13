import path from 'node:path';
import { PasswordService } from '../../services/password.js';
import { AuthService } from '../services/auth.js';
import { QueryLoaderService } from '../../services/query-loader.js';

const setupServices = async (fastify) => {
  const queryDir = path.join(process.cwd(), 'src/infrastructure/repos');
  const queryLoaderService = new QueryLoaderService(queryDir);
  fastify.di.queryLoaderService = queryLoaderService;
  fastify.di.passwordService = PasswordService;
  fastify.addHook('preHandler', (req, reply, done) => {
    req.di.authService = new AuthService(req);
    req.di.passwordService = PasswordService;
    req.di.queryLoaderService = queryLoaderService;
    done();
  });
};

export { setupServices };
