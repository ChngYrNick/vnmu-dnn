const LangCode = Object.freeze({ EN: 'en', UK: 'uk' });

const supportedLangs = [
  { name: 'English', code: LangCode.EN, default: true },
  { name: 'Українська', code: LangCode.UK, default: false },
];

const getDefaultLang = () => supportedLangs.find((lang) => lang.default);

const getLangCodes = () => supportedLangs.map((lang) => lang.code);

const getSupportedLangs = () => supportedLangs;

export { LangCode, getSupportedLangs, getDefaultLang, getLangCodes };
