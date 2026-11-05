import type { Scope } from '../../../lib/scope';
import { $$, must } from '../../../lib/dom';

/* ---------- sticky header: gets a soft backing once the page scrolls ---------- */
export function stickyHeader(S: Scope): void {
  const hdr = must('.hdr'); const upd = () => hdr.classList.toggle('stuck', scrollY > 24);
  S.on(window, 'scroll', upd, { passive: true }); upd();
}

/* ---------- live clock ---------- */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export function liveClock(S: Scope): void {
  function tickClock() {
    const d = new Date(), h = d.getHours();
    const time = `${h % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')}${h < 12 ? 'am' : 'pm'}`;
    const date = `${d.getDate()} ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
    $$('[data-time]').forEach((e) => (e.textContent = time));
    $$('[data-date]').forEach((e) => (e.textContent = date));
    $$('[data-dshort]').forEach((e) => (e.textContent = `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`));
    $$('[data-navtime]').forEach((e) => (e.textContent = ' — ' + time));
  }
  tickClock(); S.interval(tickClock, 1000);
}
