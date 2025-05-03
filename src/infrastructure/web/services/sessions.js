class SessionsService {
  #request = null;

  constructor(request) {
    this.#request = request;
  }

  async checkAuth() {
    const user = await this.getCurrentUser();
    return !!user;
  }

  async getCurrentUser() {
    return this.#request.session.data;
  }

  async updateSession(user) {
    this.#request.session.data = user;
  }

  async startSession(user) {
    this.#request.session.data = user;
    return this.#request.session.save();
  }

  async destroySession() {
    return this.#request.session.destroy();
  }
}

export { SessionsService };
