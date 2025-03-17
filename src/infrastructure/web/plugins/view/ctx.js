import { PAGES } from './pages.js';

const header = [
  { name: PAGES.Home, nav: '/', translation: 'header.home' },
  { name: PAGES.About, nav: '/about', translation: 'header.about' },
  { name: PAGES.Staff, nav: '/staff', translation: 'header.staff' },
  { name: PAGES.News, nav: '/news', translation: 'header.news' },
  { name: PAGES.Student, nav: '/student', translation: 'header.student' },
  { name: PAGES.Intern, nav: '/intern', translation: 'header.intern' },
  { name: PAGES.Listener, nav: '/listener', translation: 'header.listener' },
  { name: PAGES.Syllabus, nav: '/syllabus', translation: 'header.syllabus' },
  {
    name: PAGES.Literature,
    nav: '/literature',
    translation: 'header.literature',
  },
];

const ctx = { header };

export { ctx };
