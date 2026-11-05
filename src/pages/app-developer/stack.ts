import type { Scope } from '../../lib/scope';
import { $$, must } from '../../lib/dom';
import { room } from './state';

/* The stack of app cards: each phone shows a still screenshot, screens restart once out of sight, cards settle back as the next one slides over.
   The cards themselves are rendered from data.ts (the original built them from PROJECTS when the page had no pre-rendered markup). */

interface Shot {
  c: HTMLElement; img: HTMLImageElement; scr: HTMLElement;
  pos: number; dist: number; dir: number; wait: number; held: boolean; covered?: boolean;
  measure: () => void;
}
interface Screen { c: HTMLElement; scr: HTMLElement; hidden: boolean; s: Shot | undefined }

export function stack(S: Scope): void {
  const stack = must('#stack');
  const cards = $$('.card', stack);
  // each live page scrolls itself top to bottom and back on its screen
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // inside the home page the room is loaded early, out of sight: nothing plays until you have walked in and it has faded up
  room.live = !document.documentElement.classList.contains('embed');
  room.restartAll = () => {};
  const SPEED = 230, REST = 1100;           // screen pixels a second, pause at each end (ms)
  const shots = cards.map((c): Shot | null => {
    const img = c.querySelector<HTMLImageElement>('img.page'), scr = c.querySelector<HTMLElement>('.phone__screen'); if (!img || !scr) return null;
    const s: Shot = { c, img, scr, pos: 0, dist: 0, dir: 1, wait: REST, held: false, measure: () => {} };
    const measure = () => { s.dist = Math.max(0, img.offsetHeight - scr.clientHeight); s.pos = Math.min(s.pos, s.dist); paint(s); };
    if (img.complete && img.naturalWidth) measure(); else img.addEventListener('load', measure, { once: true });
    s.measure = measure;
    return s;
  }).filter((s): s is Shot => !!s);
  function paint(s: Shot) { s.img.style.transform = `translate3d(0,${-Number(s.pos.toFixed(1))}px,0)`; }
  S.on(window, 'resize', () => shots.forEach((s) => s.measure()));
  // once a screen has been completely out of sight (scrolled away, or fully covered by the card stacked over it),
  // it starts again from the top of its page the next time it shows
  const screens: Screen[] = cards.map((c) => ({ c, scr: must('.phone__screen', c), hidden: true, s: shots.find((x) => x.c === c) }));
  function restart(o: Screen) {
    if (o.s) { o.s.pos = 0; o.s.dir = 1; o.s.wait = REST; paint(o.s); }
  }
  function checkHidden() {
    screens.forEach((o, i) => {
      const r = o.scr.getBoundingClientRect();
      let hidden = r.bottom <= 0 || r.top >= innerHeight;
      if (!hidden) for (let k = i + 1; k < cards.length; k++) { const n = cards[k].getBoundingClientRect(); if (n.top <= r.top + 1 && n.bottom >= r.bottom - 1) { hidden = true; break; } }
      if (hidden && !o.hidden) restart(o);
      o.hidden = hidden;
      if (o.s) o.s.covered = hidden;
    });
  }
  room.checkHidden = checkHidden;
  room.restartAll = () => { screens.forEach(restart); };
  S.add(() => { room.checkHidden = room.restartAll = () => {}; room.live = false; });
  S.on(window, 'scroll', checkHidden, { passive: true }); S.on(window, 'resize', checkHidden);
  let lastT = 0;
  function run(t: number) {
    if (!room.live) { lastT = t; S.raf(run); return; }
    const dt = Math.min(64, t - (lastT || t)); lastT = t;
    if (!reduced) for (const s of shots) {
      if (s.held || s.covered || !s.c.classList.contains('on') || !s.dist) continue;
      if (s.wait > 0) { s.wait -= dt; continue; }
      const left = s.dir > 0 ? s.dist - s.pos : s.pos;
      const ease = Math.min(1, 0.3 + left / 160) * Math.min(1, 0.35 + (s.dist - left) / 160);   // eases in and out at each end
      s.pos += s.dir * SPEED * ease * dt / 1000;
      if (s.pos >= s.dist) { s.pos = s.dist; s.dir = -1; s.wait = REST; }
      else if (s.pos <= 0) { s.pos = 0; s.dir = 1; s.wait = REST; }
      paint(s);
    }
    S.raf(run);
  }
  S.raf(run);
  checkHidden();
  // mark what's on screen
  const io = S.observe(new IntersectionObserver((es) => es.forEach((e) => {
    const c = e.target; c.classList.toggle('on', e.isIntersecting);
    if (e.isIntersecting) c.classList.add('seen');
  }), { threshold: 0.25 }));
  cards.forEach((c) => io.observe(c));
  // stacking: as the next card slides over, the one beneath settles back a little
  let ticking = false;
  function stackFx() {
    ticking = false;
    cards.forEach((c, i) => {
      const next = cards[i + 1]; let p = 0;
      if (next) { const top = parseFloat(getComputedStyle(c).top), h = c.offsetHeight; p = Math.min(1, Math.max(0, (top + h - next.getBoundingClientRect().top) / h)); }
      c.style.transform = p ? `scale(${(1 - p * 0.06).toFixed(4)})` : '';
      (c.lastElementChild as HTMLElement).style.opacity = (p * 0.28).toFixed(3);
    });
  }
  if (!reduced) { S.on(window, 'scroll', () => { if (!ticking) { ticking = true; S.raf(stackFx); } }, { passive: true }); stackFx(); }
}
