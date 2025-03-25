import { supportedLangs } from '../config/language.js';

class LanguageService {
  #request = null;

  constructor(request) {
    this.#request = request;
  }

  static readDefault() {
    return supportedLangs.find((lang) => lang.default);
  }

  static readCodes() {
    return supportedLangs.map((lang) => lang.code);
  }

  static read() {
    return supportedLangs;
  }

  translate(key = '', options = {}) {
    return this.#request.t(key, options);
  }
}

export { LanguageService };
