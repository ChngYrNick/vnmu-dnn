class LanguageService {
  #langs = null;

  constructor(langs) {
    this.#langs = langs;
  }

  readDefault() {
    return this.#langs.find((lang) => lang.default);
  }

  readCodes() {
    return this.#langs.map((lang) => lang.code);
  }

  read() {
    return this.#langs;
  }
}

export { LanguageService };
