class SessionsService {
  #request = null;

  constructor(request) {
    this.#request = request;
  }

  async checkAuth() {
    return !!this.getCurrentUser();
  }

  async getCurrentUser() {
    return this.#request.session.user;
  }

  async startSession(user) {
    this.#request.session.user = user;
  }
}

export { SessionsService };
