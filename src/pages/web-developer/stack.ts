import type { Scope } from '../../lib/scope';
import { $, $$, must } from '../../lib/dom';

/*
 * The stacked project cards of a room (shared by web-developer and ui-ux-designer; the original 01 scripts differ only
 * in their PROJECTS, which are rendered by <ProjectCards>). Port of 01-body.js's behaviour.
 *
 * `room` replaces the original's window globals (__live, __liveT, __restartAll, checkHidden) shared with the embed
 * bridge (02-body.js, ./embed.ts). Only one room is mounted at a time; `projectStack` resets it on mount and unmount.
 */
export const room = {
  /** inside the home page the room is loaded early, out of sight: nothing plays until you have walked in and it has faded up */
  live: true,
  /** the embed bridge's pending "go live" timer */
  liveT: 0,
  restartAll: (): void => {},
  checkHidden: (): void => {},
};

interface Shot {
  c: HTMLElement; img: HTMLImageElement; scr: HTMLElement;
  pos: number; dist: number; dir: number; wait: number; held: boolean; covered: boolean;
  measure: () => void;
}

export function projectStack(S: Scope): void {
  const stack = must('#stack');
  const cards = $$('.card', stack);
  // a recording's screen takes the recording's own shape, so nothing is cropped or letterboxed
  cards.forEach((c) => {
    const v = $<HTMLVideoElement>('video', c); if (!v) return; const scr = v.parentElement!; scr.classList.add('vid');
    v.defaultMuted = true; v.muted = true; // the markup's `muted` attribute (React only sets the property): muted recordings may play on their own
    const set = () => { if (v.videoWidth) scr.style.setProperty('--ar', v.videoWidth + ' / ' + v.videoHeight); };
    if (v.readyState >= 1) set(); else v.addEventListener('loadedmetadata', set, { once: true });
  });
  // each live page scrolls itself top to bottom and back on its screen
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // inside the home page the room is loaded early, out of sight: nothing plays until you have walked in and it has faded up
  room.live = !document.documentElement.classList.contains('embed');
  room.restartAll = () => {};
  S.add(() => { room.live = true; room.restartAll = () => {}; room.checkHidden = () => {}; });
  const SPEED = 230, REST = 1100; // screen pixels a second, pause at each end (ms)
  const paint = (s: Shot) => { s.img.style.transform = `translate3d(0,${-Number(s.pos.toFixed(1))}px,0)`; };
  const shots = cards.map((c) => {
    const img = $<HTMLImageElement>('img.page', c), scr = must('.mon__screen', c); if (!img) return null;
    const s: Shot = { c, img, scr, pos: 0, dist: 0, dir: 1, wait: REST, held: false, covered: false, measure: () => {} };
    const measure = () => { s.dist = Math.max(0, img.offsetHeight - scr.clientHeight); s.pos = Math.min(s.pos, s.dist); paint(s); };
    if (img.complete && img.naturalWidth) measure(); else img.addEventListener('load', measure, { once: true });
    s.measure = measure;
    return s;
  }).filter((s): s is Shot => s !== null);
  S.on(window, 'resize', () => shots.forEach((s) => s.measure()));
  // once a screen has been completely out of sight (scrolled away, or fully covered by the card stacked over it),
  // it starts again from the top of its page the next time it shows
  const screens = cards.map((c) => ({ c, scr: must('.mon__screen', c), hidden: true, s: shots.find((x) => x.c === c), v: $<HTMLVideoElement>('video', c) }));
  type Screen = (typeof screens)[number];
  const restart = (o: Screen) => {
    if (o.s) { o.s.pos = 0; o.s.dir = 1; o.s.wait = REST; paint(o.s); }
    if (o.v) { try { o.v.currentTime = 0; } catch { /* not seekable yet */ } }
  };
  const checkHidden = () => {
    screens.forEach((o, i) => {
      const r = o.scr.getBoundingClientRect();
      let hidden = r.bottom <= 0 || r.top >= innerHeight;
      if (!hidden) for (let k = i + 1; k < cards.length; k++) { const n = cards[k].getBoundingClientRect(); if (n.top <= r.top + 1 && n.bottom >= r.bottom - 1) { hidden = true; break; } }
      if (hidden && !o.hidden) restart(o);
      o.hidden = hidden;
      if (o.v) { if (hidden) o.v.pause(); else if (o.c.classList.contains('on') && room.live) o.v.play().catch(() => {}); }
      if (o.s) o.s.covered = hidden;
    });
  };
  room.checkHidden = checkHidden;
  room.restartAll = () => { screens.forEach((o) => { restart(o); if (o.v) o.v.pause(); }); };
  S.on(window, 'scroll', checkHidden, { passive: true }); S.on(window, 'resize', checkHidden);
  let lastT = 0;
  const run = (t: number) => {
    if (!room.live) { lastT = t; S.raf(run); return; }
    const dt = Math.min(64, t - (lastT || t)); lastT = t;
    if (!reduced) for (const s of shots) {
      if (s.held || s.covered || !s.c.classList.contains('on') || !s.dist) continue;
      if (s.wait > 0) { s.wait -= dt; continue; }
      const left = s.dir > 0 ? s.dist - s.pos : s.pos;
      const ease = Math.min(1, 0.3 + left / 160) * Math.min(1, 0.35 + (s.dist - left) / 160); // eases in and out at each end
      s.pos += s.dir * SPEED * ease * dt / 1000;
      if (s.pos >= s.dist) { s.pos = s.dist; s.dir = -1; s.wait = REST; }
      else if (s.pos <= 0) { s.pos = 0; s.dir = 1; s.wait = REST; }
      paint(s);
    }
    S.raf(run);
  };
  S.raf(run);
  checkHidden();
  // play only what's on screen
  const io = S.observe(new IntersectionObserver((es) => es.forEach((e) => {
    const c = e.target; c.classList.toggle('on', e.isIntersecting);
    if (e.isIntersecting) c.classList.add('seen');
    const v = $<HTMLVideoElement>('video', c); if (v) { if (e.isIntersecting && room.live) v.play().catch(() => {}); else v.pause(); }
  }), { threshold: 0.25 }));
  cards.forEach((c) => io.observe(c));
  // stacking: as the next card slides over, the one beneath settles back a little
  let ticking = false;
  const stackFx = () => {
    ticking = false;
    cards.forEach((c, i) => {
      const next = cards[i + 1]; let p = 0;
      if (next) { const top = parseFloat(getComputedStyle(c).top), h = c.offsetHeight; p = Math.min(1, Math.max(0, (top + h - next.getBoundingClientRect().top) / h)); }
      c.style.transform = p ? `scale(${(1 - p * 0.06).toFixed(4)})` : '';
      (c.lastElementChild as HTMLElement).style.opacity = (p * 0.28).toFixed(3);
    });
  };
  if (!reduced) { S.on(window, 'scroll', () => { if (!ticking) { ticking = true; S.raf(stackFx); } }, { passive: true }); stackFx(); }
}
