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
import { SpecialtiesContentRepo } from '../../repos/specialties-content/specialties-content.js';
import { StudentMaterialsRepo } from '../../repos/student-materials/student-materials.js';
import { StudentMaterialsContentRepo } from '../../repos/student-materials-content/student-materials-content.js';
import { StudentMaterialsFileRepo } from '../../repos/student-materials-file/student-materials-file.js';
import { StaffRepo } from '../../repos/staff/staff.js';
import { StaffContentRepo } from '../../repos/staff-content/staff-content.js';
import { StaffFileRepo } from '../../repos/staff-file/staff-file.js';

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
  const specialtiesContentRepo = new SpecialtiesContentRepo(
    db,
    queryLoaderService,
  );
  const studentMaterialsRepo = new StudentMaterialsRepo(db, queryLoaderService);
  const studentMaterialsContentRepo = new StudentMaterialsContentRepo(
    db,
    queryLoaderService,
  );
  const studentMaterialsFileRepo = new StudentMaterialsFileRepo(
    db,
    queryLoaderService,
    filesRepo,
  );
  const staffRepo = new StaffRepo(db, queryLoaderService);
  const staffContentRepo = new StaffContentRepo(db, queryLoaderService);
  const staffFileRepo = new StaffFileRepo(db, queryLoaderService, filesRepo);
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
  fastify.di.specialtiesContentRepo = specialtiesContentRepo;
  fastify.di.studentMaterialsRepo = studentMaterialsRepo;
  fastify.di.studentMaterialsContentRepo = studentMaterialsContentRepo;
  fastify.di.studentMaterialsFileRepo = studentMaterialsFileRepo;
  fastify.di.staffRepo = staffRepo;
  fastify.di.staffContentRepo = staffContentRepo;
  fastify.di.staffFileRepo = staffFileRepo;
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
    req.di.specialtiesContentRepo = specialtiesContentRepo;
    req.di.studentMaterialsRepo = studentMaterialsRepo;
    req.di.studentMaterialsContentRepo = studentMaterialsContentRepo;
    req.di.studentMaterialsFileRepo = studentMaterialsFileRepo;
    req.di.staffRepo = staffRepo;
    req.di.staffContentRepo = staffContentRepo;
    req.di.staffFileRepo = staffFileRepo;
    done();
  });
};

export { setupRepos };
