import { SetupRepo } from '../../repos/setup/setup.js';
import { UserRepo } from '../../repos/user/user.js';
import { SessionsSyncRepo } from '../../repos/sessions/sessions-sync.js';
import { SessionsRepo } from '../../repos/sessions/sessions.js';
import { PagesRepo } from '../../repos/pages/pages.js';
import { PagesContentRepo } from '../../repos/pages-content/pages-content.js';
import { FilesRepo } from '../../repos/files/files.js';
import { PagesFileRepo } from '../../repos/pages-file/pages-file.js';
import { ContactsRepo } from '../../repos/contacts/contacts.js';
import { SpecialtiesRepo } from '../../repos/specialties/specialties.js';

const setupRepos = async (fastify) => {
  const { db, queryLoaderService } = fastify.di;
  const setupRepo = new SetupRepo(db, queryLoaderService);
  const userRepo = new UserRepo(db, queryLoaderService);
  const sessionsRepo = new SessionsRepo(db, queryLoaderService);
  const sessionsSyncRepo = new SessionsSyncRepo(db, queryLoaderService);
  const pagesRepo = new PagesRepo(db, queryLoaderService);
  const pagesContentRepo = new PagesContentRepo(db, queryLoaderService);
  const filesRepo = new FilesRepo(db, queryLoaderService);
  const pagesFileRepo = new PagesFileRepo(db, queryLoaderService, filesRepo);
  const contactsRepo = new ContactsRepo(db, queryLoaderService);
  const specialtiesRepo = new SpecialtiesRepo(db, queryLoaderService);
  fastify.di.userRepo = userRepo;
  fastify.di.setupRepo = setupRepo;
  fastify.di.sessionsRepo = sessionsRepo;
  fastify.di.sessionsSyncRepo = sessionsSyncRepo;
  fastify.di.pagesRepo = pagesRepo;
  fastify.di.pagesContentRepo = pagesContentRepo;
  fastify.di.filesRepo = filesRepo;
  fastify.di.pagesFileRepo = pagesFileRepo;
  fastify.di.contactsRepo = contactsRepo;
  fastify.di.specialtiesRepo = specialtiesRepo;
  fastify.addHook('preHandler', (req, reply, done) => {
    req.di.userRepo = userRepo;
    req.di.setupRepo = setupRepo;
    req.di.sessionsRepo = sessionsRepo;
    req.di.sessionsSyncRepo = sessionsSyncRepo;
    req.di.pagesRepo = pagesRepo;
    req.di.pagesContentRepo = pagesContentRepo;
    req.di.filesRepo = filesRepo;
    req.di.pagesFileRepo = pagesFileRepo;
    req.di.contactsRepo = contactsRepo;
    req.di.specialtiesRepo = specialtiesRepo;
    done();
  });
};

export { setupRepos };
