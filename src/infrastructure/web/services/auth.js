class AuthService {
  #request = null;

  constructor(request) {
    this.#request = request;
  }

  async checkAuth() {
    return this.#request
      .jwtVerify()
      .then(() => true)
      .catch(() => false);
  }


}

export { AuthService };
