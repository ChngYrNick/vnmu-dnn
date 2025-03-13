import { SessionsRepo } from './sessions.js';

class SessionsSyncRepo {
  #sessionsRepo = null;

  constructor(db, loader) {
    this.#sessionsRepo = new SessionsRepo(db, loader);
  }

  get(sessionId, callback) {
    this.#sessionsRepo
      .get(sessionId)
      .then((result) => callback(null, result))
      .catch((err) => callback(err));
  }

  set(sessionId, session, callback) {
    this.#sessionsRepo
      .set(sessionId, session)
      .then(() => callback(null))
      .catch((err) => callback(err));
  }

  destroy(sessionId, callback) {
    this.#sessionsRepo
      .destroy(sessionId)
      .then(() => callback(null))
      .catch((err) => callback(err));
  }
}

export { SessionsSyncRepo };
