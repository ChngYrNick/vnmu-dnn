class LogoutUseCase {
  #sessionsService = null;

  constructor({ sessionsService }) {
    this.#sessionsService = sessionsService;
  }

  async exec() {
    return this.#sessionsService.destroySession();
  }
}

export { LogoutUseCase };
