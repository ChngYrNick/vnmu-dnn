import { getSupportedLangs } from '../../../../domain/langs.js';
import { PAGES } from './pages.js';

const nav = [
  { name: PAGES.Home, nav: '/', translation: 'nav.home' },
  { name: PAGES.About, nav: '/about', translation: 'nav.about' },
  { name: PAGES.Staff, nav: '/staff', translation: 'nav.staff' },
  { name: PAGES.News, nav: '/news', translation: 'nav.news' },
  { name: PAGES.Student, nav: '/student', translation: 'nav.student' },
  { name: PAGES.Intern, nav: '/intern', translation: 'nav.intern' },
  { name: PAGES.Listener, nav: '/listener', translation: 'nav.listener' },
  { name: PAGES.Syllabus, nav: '/syllabus', translation: 'nav.syllabus' },
  {
    name: PAGES.Literature,
    nav: '/literature',
    translation: 'nav.literature',
  },
];

const ctx = { nav, supportedLangs: getSupportedLangs() };

export { ctx };
