import type { Scope } from '../../../lib/scope';
import { $, $$, must } from '../../../lib/dom';
import { detach, hooks, reduced, startScroll, stopScroll } from './state';

/* ---------- PageLoader: the doors' colours stack up as the page loads, then slides apart to open it ---------- */
export function pageLoader(S: Scope): void {
  const loader = must('#loader');
  const body = document.body;
  S.add(() => body.classList.remove('ready'));
  const introReady = () => dispatchEvent(new Event('intro:ready'));
  // back from a door's page (#works): skip the intro and stand in front of the doors again
  // (#about and #contact come from the links in a room's navbar and footer)
  if (['#works', '#about', '#contact'].includes(location.hash)) {
    detach(loader);
    body.classList.add('ready');
    const wantContact = location.hash === '#contact';
    S.raf(() => {
      if (wantContact) S.timeout(() => hooks.openModal?.(), 400);
      const el = $(location.hash === '#about' ? '#about' : '#works');
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + pageYOffset);
      introReady();
    });
    return;
  }
  stopScroll();
  // whatever happens in the intro, the site always opens: any error, or an intro that hasn't finished in 9 s, lets you straight in
  let introDone = false;
  const bailOut = () => {
    if (introDone) return; introDone = true;
    try { detach(loader); } catch { /* already gone */ }
    body.classList.add('ready'); startScroll(); introReady();
  };
  hooks.introBail = bailOut;
  S.timeout(bailOut, 9000);
  try {
    const num = must('#ldCount'), pills = $$('.ld__pill', loader);
    const ease = (t: number) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    // real progress: fonts first, then the page's images; the counter never runs ahead of what has actually loaded
    let ready = .55;
    document.fonts?.ready.then(() => { ready = Math.max(ready, .85); });
    const loaded = () => { ready = 1; };
    if (document.readyState === 'complete') loaded(); else S.on(window, 'load', loaded, { once: true });
    S.timeout(loaded, 5000);                               // never keep anyone waiting long
    // one colour joins the stack for each sixth of the way
    const paint = (p: number) => { loader.style.setProperty('--p', p.toFixed(3)); pills.forEach((el, k) => el.classList.toggle('on', p >= k / 6 + .02 || p >= 1)); };
    const FILL = 1600;
    let t0: number | null = null, shown = 0;
    const loadTick = (now: number) => {
      if (t0 === null) t0 = now;
      const want = Math.min(ease(Math.min(1, (now - t0) / FILL)), ready);
      shown += (want - shown) * .18; if (want - shown < .002) shown = want;
      paint(shown);
      num.textContent = String(Math.round(shown * 100)).padStart(3, '0');
      if (shown < 1) S.raf((t) => { try { loadTick(t); } catch { bailOut(); } }); else S.timeout(finish, 520);   // the last colour lands, then it opens
    };
    const finish = () => {
      loader.classList.add('out');                             // the colours slide away and the curtain lifts
      S.timeout(() => body.classList.add('ready'), 260);   // the hero plays its entrance as it is uncovered
      S.timeout(bailOut, 1250);
    };
    if (reduced) { num.textContent = '100'; paint(1); S.timeout(finish, 500); }
    else S.raf((t) => { try { loadTick(t); } catch { bailOut(); } });
  } catch { bailOut(); }
}

/* ---------- Clean routes: the address bar reads /home, /work or /my-story as you move through the page ---------- */
export function cleanRoutes(S: Scope): void {
  // (the original's condition also had a `!true ||` in front: a build switch that is always on)
  if (location.protocol === 'file:') return;
  const dir = location.pathname.replace(/[^/]*$/, '');            // where the site lives (root or a subfolder)
  const ROUTE: Record<string, string> = { home: 'home', works: 'work', about: 'my-story' };
  let cur = '';
  const set = (name: string) => {
    if (name === cur || (history.state && history.state.wall)) return;   // never while a door's page is open
    cur = name;
    try { history.replaceState(history.state, '', dir + ROUTE[name]); } catch { /* history blocked */ }
  };
  const first = location.hash === '#about' ? 'about' : location.hash === '#works' ? 'works' : 'home';
  S.on(window, 'intro:ready', () => {
    set(first);
    const io = S.observe(new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) set(e.target.id === 'works' ? 'works' : e.target.id === 'about' ? 'about' : 'home'); }),
      { rootMargin: '-45% 0px -45% 0px' }));
    ['home', 'works', 'about'].forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
  }, { once: true });
}
