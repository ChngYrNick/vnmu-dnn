import { SetupRepo } from '../../repos/setup/setup.js';
import { UserRepo } from '../../repos/user/user.js';
import { RolesRepo } from '../../repos/roles/roles.js';

const setupRepos = async (fastify) => {
  const { db, queryLoader } = fastify.di;
  const setupRepo = new SetupRepo(db, queryLoader);
  const userRepo = new UserRepo(db, queryLoader);
  const rolesRepo = new RolesRepo(db, queryLoader);
  fastify.di.userRepo = userRepo;
  fastify.di.rolesRepo = rolesRepo;
  fastify.di.setupRepo = setupRepo;
  fastify.addHook('preHandler', (req, reply, done) => {
    req.di.userRepo = userRepo;
    req.di.rolesRepo = rolesRepo;
    req.di.setupRepo = setupRepo;
    done();
  });
};

export { setupRepos };
