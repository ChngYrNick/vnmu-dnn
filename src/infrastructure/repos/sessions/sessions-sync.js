import { SessionsRepo } from './sessions.js';

class SessionsSyncRepo {
  #sessionsRepo = null;

  constructor(db, loader) {
    this.#sessionsRepo = new SessionsRepo(db, loader);
  }

  touch(sessionId, session, callback) {
    this.#sessionsRepo
      .touch(sessionId, session)
      .then(() => callback(null))
      .catch((err) => callback(err));
  }

  get(sessionId, callback) {
    this.#sessionsRepo
      .get(sessionId)
      .then((result) => callback(null, result))
      .catch((err) => callback(err));
  }

  getByUserId(userId, callback) {
    this.#sessionsRepo
      .getByUserId(userId)
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
