import type { Behavior } from '../../lib/scope';
import { $$ } from '../../lib/dom';
import { analytics } from '../../behaviors/analytics';

/** The email address is assembled here rather than written in the page; the footer year. */
const mailAndYear: Behavior = () => {
  const m = ['madhavkalra2005', 'gmail.com'].join('@');
  $$<HTMLAnchorElement>('[data-mail]').forEach((a) => { a.href = 'mailto:' + m; a.textContent = m; });
  $$('[data-fyear]').forEach((e) => (e.textContent = String(new Date().getFullYear())));
};

// ported page behaviours, in original script order (00-head.js is the pre-paint script in index.html)
export const behaviors: Behavior[] = [
  mailAndYear, // 01
  analytics,   // 02
];
