import { supportedLangs } from '../config/language.js';

class LanguageService {
  #request = null;
  #reply = null;

  constructor(request, reply) {
    this.#request = request;
    this.#reply = reply;
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

  changeLanguage(language) {
    this.#reply.setCookie('language', language, {
      path: '/',
      maxAge: 365 * 24 * 60 * 60,
      httpOnly: true,
      signed: false,
    });
  }
}

export { LanguageService };
