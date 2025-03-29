import { DI } from './di.js';

const REQ_DI = {
  ...DI,
  sessionsService: null,
  languageService: null,
  errorService: null,
};

export { REQ_DI };
