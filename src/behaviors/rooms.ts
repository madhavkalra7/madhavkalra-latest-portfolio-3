import type { Behavior, Scope } from '../lib/scope';
import { $, $$, must, selfOrigin } from '../lib/dom';

/* Behaviours shared by the "rooms" (the pages behind the home page's doors). */

/**
 * Every image and recording starts on a shimmering placeholder, which lifts as soon as it has something to show.
 * @param selector which media to watch ('main img, main video' in most rooms, '.ph img' on the photo wall)
 */
export const skeletons = (selector: string): Behavior => (S: Scope) => {
  const done = (el: HTMLElement) => el.parentElement?.classList.remove('skel');
  const watch = (el: HTMLImageElement | HTMLVideoElement) => {
    const box = el.parentElement; if (!box || box.dataset.sk || el.closest('.app')) return; box.dataset.sk = '1'; // small app icons load instantly: no placeholder
    if (el instanceof HTMLImageElement) {
      if (el.complete && el.naturalWidth) return;
      box.classList.add('skel');
      el.addEventListener('load', () => done(el), { once: true }); el.addEventListener('error', () => done(el), { once: true });
    } else {
      // whenever it has to wait for more of the recording, the shimmer comes back over the poster
      el.addEventListener('waiting', () => box.classList.add('skel-buf'));
      ['playing', 'canplay', 'pause', 'error'].forEach((ev) => el.addEventListener(ev, () => box.classList.remove('skel-buf')));
      if (el.readyState >= 2) return;
      box.classList.add('skel');
      el.addEventListener('loadeddata', () => done(el), { once: true });
      if (el.poster) { const im = new Image(); im.onload = () => done(el); im.src = el.poster; }
    }
  };
  const scan = () => $$<HTMLImageElement | HTMLVideoElement>(selector).forEach(watch);
  scan(); S.observe(new MutationObserver(scan)).observe(document.body, { childList: true, subtree: true });
};

/** "Back to the doors" stays on screen in the corner the whole time you're inside a room. */
export function backToDoors(S: Scope): void {
  const top = $<HTMLAnchorElement>('.top .chip'); if (!top) return;
  const bar = $('.rn__in'); if (!bar) return;
  const b = document.createElement('a');
  b.className = 'backd'; b.href = top.getAttribute('href') ?? '/#works'; b.setAttribute('aria-label', 'Back to the doors');
  b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg><span>Back to the doors</span>';
  b.addEventListener('click', (e) => { e.preventDefault(); top.click(); }); // same exit as the link at the top
  bar.insertBefore(b, bar.firstChild); // first thing in the sticky bar, on the left
  top.style.visibility = 'hidden'; top.tabIndex = -1; // the pill in the bar takes its place, so there is one way back, always on screen
  S.raf(() => b.classList.add('show'));
  S.add(() => { b.remove(); top.style.visibility = ''; top.removeAttribute('tabindex'); });
}

/** The room's sticky navbar: nav buttons (or, inside the home page, messages to it), mobile menu, stuck state, date. */
export function roomNav(S: Scope): void {
  const root = document.documentElement, EMBED = root.classList.contains('embed');
  const HOME = '/';
  const SLUGS = ['web-developer', 'app-developer', 'ui-ux-designer', 'graphic-designer', 'photographer'];
  const go = (to: string) => {
    if (to === 'top') { scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (EMBED) { parent.postMessage({ wall: 'go', to }, selfOrigin()); return; }
    if (to === 'home') location.href = HOME;
    else if (to === 'about') location.href = HOME + '#about';
    else if (to === 'contact') location.href = HOME + '#contact';
    else if (to.startsWith('door:')) location.href = HOME + '#' + SLUGS[+to.slice(5)];
  };
  const rn = must('#rn'), menu = must('#rnMenu');
  const panel = must('#rnPanel'), pclose = must('#rnClose');
  S.on(document, 'click', (e) => {
    const b = (e.target as Element).closest<HTMLElement>('[data-nav]'); if (!b) return;
    if (b.tagName === 'A' && (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button)) return; // new tab: let the link do it
    e.preventDefault(); rn.classList.remove('open'); menu.setAttribute('aria-expanded', 'false');
    const to = b.dataset.nav!;
    if (b.hasAttribute('aria-current')) { scrollTo({ top: 0, behavior: 'smooth' }); return; }
    go(to);
  });
  // each line in the menu knows its place, so they rise in one after another
  $$('.rn__plist button', panel).forEach((b, i) => b.style.setProperty('--i', String(i)));
  const setMenu = (o: boolean) => {
    rn.classList.toggle('open', o);
    menu.setAttribute('aria-expanded', String(o));
    root.classList.toggle('rn-lock', o); // the page behind stops scrolling
    if (o) S.timeout(() => pclose.focus(), 60); else menu.focus();
  };
  S.on(menu, 'click', () => setMenu(!rn.classList.contains('open')));
  S.on(pclose, 'click', () => setMenu(false));
  S.on(window, 'keydown', (e) => {
    if (!rn.classList.contains('open')) return;
    if (e.key === 'Escape') { setMenu(false); return; }
    if (e.key !== 'Tab') return; // the keyboard stays inside the open menu
    const f = $$('button', panel).filter((n) => n.offsetWidth || n.offsetHeight);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (!panel.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  S.on(panel, 'click', (e) => { if ((e.target as Element).closest('button[data-nav]')) setMenu(false); });
  S.on(matchMedia('(min-width:1200px)'), 'change', (e) => { if (e.matches) setMenu(false); });
  const upd = () => rn.classList.toggle('stuck', scrollY > 10);
  S.on(window, 'scroll', upd, { passive: true }); upd();
  // content that sticks (the project cards) parks below the navbar, never behind it
  const navH = () => { root.style.setProperty('--nav-h', rn.offsetHeight + 'px'); root.style.setProperty('--rn-h', rn.offsetHeight + 'px'); };
  navH(); S.on(window, 'resize', navH); S.observe(new ResizeObserver(navH)).observe(rn);
  S.add(() => root.classList.remove('rn-lock'));
  const M = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const d = new Date(), short = matchMedia('(max-width: 767.98px)').matches;
  $$('[data-fdate]').forEach((e) => (e.textContent = short ? `${d.getDate()} ${M[d.getMonth()].slice(0, 3)}` : `${d.getDate()} ${M[d.getMonth()]}, ${d.getFullYear()}`));
}
