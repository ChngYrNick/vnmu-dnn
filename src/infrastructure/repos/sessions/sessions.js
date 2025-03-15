class SessionsRepo {
  #loader = null;
  #db = null;

  constructor(db, loader) {
    this.#db = db;
    this.#loader = loader;
  }

  async touch(sessionId, session) {
    const query = this.#loader.get('sessions/update-by-sid.sql');
    const expires = session.expires ? session.expires.getTime() : Date.now();
    this.#db.prepare(query).run(expires, sessionId);
  }

  async get(sessionId) {
    const query = this.#loader.get('sessions/select-by-sid.sql');
    const row = this.#db.prepare(query).get(sessionId);

    if (!row) return null;

    return {
      sid: row.sid,
      expires: new Date(row.expires),
      data: JSON.parse(row.data),
    };
  }

  async set(sessionId, session) {
    const query = this.#loader.get('sessions/insert-or-replace.sql');
    const expires = session.expires ? session.expires.getTime() : Date.now();
    const data = JSON.stringify(session.data);
    this.#db.prepare(query).run(sessionId, expires, data);
  }

  async destroy(sessionId) {
    const query = this.#loader.get('sessions/delete-by-sid.sql');
    this.#db.prepare(query).run(sessionId);
  }
}

export { SessionsRepo };
