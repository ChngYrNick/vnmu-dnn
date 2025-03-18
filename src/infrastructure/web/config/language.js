import { LangCode } from '../../../domain/langs.js';

const supportedLangs = [
  { name: 'English', code: LangCode.EN, default: true },
  { name: 'Українська', code: LangCode.UK, default: false },
];

export { supportedLangs };
