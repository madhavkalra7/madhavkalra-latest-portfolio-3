import type { Scope } from '../../lib/scope';
import { $$, must } from '../../lib/dom';
import { WORLDS, type Slide } from './data';

/* The worlds: each one a washing line of prints you walk along by scrolling, plus the lightbox.
   The worlds themselves are rendered from data.ts (the original built them from WORLDS when the page had no pre-rendered markup). */

const esc = (s: unknown) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));

interface Print { el: HTMLElement; a: number; v: number; ph: number; sp: number }
interface WorldEl { el: HTMLElement; pin: HTMLElement; track: HTMLElement; bar: HTMLElement; prints: Print[]; dist: number; x: number; lx: number }

export function gallery(S: Scope): void {
  const host = must('#worlds');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const worlds: WorldEl[] = $$('.world', host).map((el) => ({ el, pin: must('.pin', el), track: must('.track', el), bar: must('.w-bar', el),
    prints: $$('.print', el).map((p) => ({ el: p, a: 0, v: 0, ph: Math.random() * 6.28, sp: 0.7 + Math.random() * 0.5 })), dist: 0, x: 0, lx: 0 }));

  // size: every print hangs at the same height; each world is as tall as its line is long
  function layout() {
    const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
    const vh = innerHeight - nav;
    worlds.forEach((w) => {
      const head = must('.w-head', w.el).offsetHeight;
      const ph = Math.max(150, Math.min(vh - head - (innerWidth < 768 ? 110 : 150), innerWidth < 768 ? 420 : 560));
      w.el.style.setProperty('--ph', ph + 'px');
      w.prints.forEach((p) => { const img = must<HTMLImageElement>('img', p.el); img.style.width = (ph - 30) * (+p.el.style.getPropertyValue('--ar')) + 'px'; });
      // stop exactly when the last print is fully in view (the wire itself runs off both edges, so it doesn't count)
      const last = w.prints[w.prints.length - 1].el, pad = parseFloat(getComputedStyle(w.track).paddingLeft) || 0;
      w.dist = Math.max(0, last.offsetLeft + last.offsetWidth + pad - innerWidth);
      w.el.style.setProperty('--h', (vh + w.dist * (innerWidth < 768 ? 1.1 : 1)) + 'px');
    });
  }
  layout(); S.on(window, 'resize', layout); document.fonts?.ready.then(() => { if (!S.dead) layout(); });

  // scrolling down walks you along the line; the prints swing as they pass, as if the line moved
  let lastT = 0;
  function frame(t: number) {
    const dt = Math.min(48, t - (lastT || t)) / 16.67; lastT = t;
    const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
    worlds.forEach((w) => {
      const r = w.el.getBoundingClientRect(), span = Math.max(1, r.height - (innerHeight - nav));
      const p = Math.min(1, Math.max(0, (nav - r.top) / span));
      w.x = -p * w.dist;
      const vel = (w.x - w.lx) / Math.max(dt, 0.5); w.lx = w.x;
      w.track.style.transform = `translate3d(${w.x.toFixed(1)}px,0,0)`;
      w.bar.style.setProperty('--p', p.toFixed(4));
      const on = r.top < innerHeight && r.bottom > nav;
      if (!on || reduced) return;
      w.prints.forEach((pr) => {
        const idle = Math.sin(t / 1000 * pr.sp + pr.ph) * 1.1;
        const target = Math.max(-11, Math.min(11, vel * 0.55)) + idle;
        pr.v += (target - pr.a) * 0.045 * dt; pr.v *= Math.pow(0.88, dt); pr.a += pr.v * dt;
        pr.el.style.transform = `rotate(${pr.a.toFixed(2)}deg)`;
      });
    });
    S.raf(frame);
  }
  S.raf(frame);

  // ---------- lightbox ----------
  const lb = must('#lb'), lbI = must<HTMLImageElement>('#lbI'), lbT = must('#lbT'), lbD = must('#lbD');
  let L: { items: Slide[]; i: number; title: string } = { items: [], i: 0, title: '' };
  let lastFocus: HTMLElement | null = null;
  function show(i: number) {
    L.i = (i + L.items.length) % L.items.length;
    lbI.classList.add('swap');
    const it = L.items[L.i], pre = new Image(); pre.src = it.f;
    const stage = lbI.parentElement!;
    const go = () => { lbI.src = it.f; lbI.classList.remove('swap'); stage.classList.remove('ld'); };
    if (pre.complete) go(); else { if (it.w && it.h) stage.style.setProperty('--ar', (it.w / it.h).toFixed(4)); stage.classList.add('ld'); pre.onload = go; pre.onerror = go; }
    lbI.alt = `${L.title}, ${L.i + 1} of ${L.items.length}`;   // so a screen reader names the poster on screen
    lbT.innerHTML = `${esc(L.title)}<span>${L.i + 1} / ${L.items.length}</span>`;
    lbD.innerHTML = L.items.length <= 40 ? L.items.map((_, k) => `<i class="${k === L.i ? 'on' : ''}"></i>`).join('') : '';
  }
  function open(items: Slide[], i: number, title: string) {
    L = { items, i, title }; lastFocus = document.activeElement as HTMLElement | null;
    lb.hidden = false; S.raf(() => lb.classList.add('open')); show(i);
    must('#lbX').focus({ preventScroll: true });
  }
  function close() { lb.classList.remove('open'); S.timeout(() => { lb.hidden = true; }, 360); lastFocus?.focus?.({ preventScroll: true }); }
  S.on(host, 'click', (e) => {
    const b = (e.target as Element).closest('.paper'); if (!b) return;
    const wEl = b.closest<HTMLElement>('.world')!, w = WORLDS[+wEl.dataset.i!], ii = +b.closest<HTMLElement>('.print')!.dataset.ii!, it = w.items[ii];
    if (it.deck) open(it.deck, 0, it.title ?? ''); else open(w.items, ii, w.label);
  });
  S.on(must('#lbX'), 'click', close);
  S.on(must('#lbP'), 'click', () => show(L.i - 1));
  S.on(must('#lbN'), 'click', () => show(L.i + 1));
  S.on(lb, 'click', (e) => { const t = e.target as Element; if (t === lb || t.classList.contains('lb__stage')) close(); });
  S.on(window, 'keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') { e.stopImmediatePropagation(); close(); }
    if (e.key === 'ArrowRight') show(L.i + 1);
    if (e.key === 'ArrowLeft') show(L.i - 1);
    if (e.key === 'Tab') {
      // Tab stays inside the open lightbox instead of walking onto the gallery behind it
      const f = $$('button,a[href],[tabindex]:not([tabindex="-1"])', lb).filter((n) => n.offsetWidth || n.offsetHeight || n.getClientRects().length);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (!lb.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }, true);
  let sx = 0, sy = 0;
  S.on(lb, 'touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  S.on(lb, 'touchend', (e) => { const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(L.i + (dx < 0 ? 1 : -1)); }, { passive: true });
}
