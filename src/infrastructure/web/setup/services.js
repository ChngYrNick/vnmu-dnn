import path from 'node:path';
import { PasswordService } from '../../services/password.js';
import { QueryLoaderService } from '../../services/query-loader.js';
import { SessionsService } from '../services/sessions.js';
import { LanguageService } from '../services/language.js';
import { ErrorService } from '../services/error.js';
import { FileService } from '../../services/file.js';

const setupServices = async (fastify) => {
  const queryDir = path.join(process.cwd(), 'src/infrastructure/repos');
  const queryLoaderService = new QueryLoaderService(queryDir);
  fastify.di.queryLoaderService = queryLoaderService;
  fastify.di.passwordService = PasswordService;
  fastify.di.fileService = FileService;
  fastify.addHook('preHandler', (req, reply, done) => {
    req.di.sessionsService = new SessionsService(req);
    req.di.languageService = new LanguageService(req, reply);
    req.di.errorService = new ErrorService(req.di.languageService);
    req.di.passwordService = PasswordService;
    req.di.fileService = FileService;
    req.di.queryLoaderService = queryLoaderService;
    done();
  });
};

export { setupServices };
