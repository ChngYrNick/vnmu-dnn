import { BadRequestError } from '../../domain/errors/bad-request.js';

class ChangeLanguageUseCase {
  #languageService = null;

  constructor({ languageService }) {
    this.#languageService = languageService;
  }

  async exec(language) {
    if (!language) {
      throw new BadRequestError();
    }

    await this.#languageService.changeLanguage(language);
  }
}

export { ChangeLanguageUseCase };
