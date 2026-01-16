import { marked } from 'marked';
import { Roles } from '../../../../domain/roles.js';
import { ADMIN_PAGES, PAGES } from './pages.js';

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

const adminNav = [
  { name: ADMIN_PAGES.Content, nav: '/admin/content' },
  { name: ADMIN_PAGES.News, nav: '/admin/news' },
  { name: ADMIN_PAGES.Staff, nav: '/admin/staff' },
  { name: ADMIN_PAGES.Specialties, nav: '/admin/specialties' },
  { name: ADMIN_PAGES.Users, nav: '/admin/users' },
  { name: ADMIN_PAGES.Contacts, nav: '/admin/contacts' },
];

const formatDate = (dateStr, locale = 'uk') => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const truncate = (str, length) => {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

const striptags = (str) => {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '');
};

const ctx = {
  nav,
  adminNav,
  Roles,
  encodeURIComponent,
  marked,
  formatDate,
  truncate,
  striptags,
};

export { ctx };
