import type Lenis from 'lenis';
import type { Scope } from '../../../lib/scope';

/*
 * Shared top-level state of the home page's main module (05-body-module.js).
 * The original was one ES module whose sections shared `root`, `lenis`, `locks`, `scrollEnabled`, `stopScroll` /
 * `startScroll`, `scrollToId`, `spring` and `bindHovers`, plus a few `window.*` hooks between sections
 * (`window.openDoor`, `__doorHover`, `__cordWake`, `__introBail`, `__touching`, `__snapTo`). Those never cross a document,
 * so they live here instead of on `window`. Only `window.__lenis` stays global (see lenis.ts).
 */

declare global {
  interface Window {
    /** the page's Lenis instance, once loaded (desktop only) */
    __lenis?: Lenis;
    /** set by the single-file build of the site: the ability card's whole document, loaded with srcdoc */
    __ONEFILE?: { holo?: string };
  }
}

export const root = document.documentElement;
export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
export const COARSE = matchMedia('(pointer: coarse)').matches;
export const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/* ---------- scroll lock (Lenis attached once loaded) ---------- */
export const st = {
  lenis: null as Lenis | null,
  scrollEnabled: true,
  locks: 0,
  // touch state shared by the pinned sections: never snap while a finger is down or a flick is still coasting
  touching: false,
};

/** calls between the sections of the module (were `window.openDoor` etc. in the original) */
export const hooks: {
  openDoor?: (i: number) => void;
  doorHover?: (i: number) => void;
  cordWake?: () => void;
  introBail?: () => void;
  openModal?: () => void;
  toggleMode?: () => void;
} = {};

export function snapTo(top: number): void {
  if (!COARSE && st.lenis) st.lenis.scrollTo(top, { duration: 0.6, easing: (x) => 1 - Math.pow(1 - x, 3) });
  else scrollTo({ top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}
export function stopScroll(): void {
  st.locks++; st.scrollEnabled = false; st.lenis?.stop();
  Object.assign(root.style, { position: 'relative', overflow: 'hidden', height: '100%' });
}
export function startScroll(): void {
  st.locks = Math.max(0, st.locks - 1); if (st.locks) return;
  st.scrollEnabled = true; st.lenis?.start();
  root.style.removeProperty('position'); root.style.removeProperty('overflow'); root.style.removeProperty('height');
}
export function scrollToId(S: Scope, id: string): void {
  const el = document.getElementById(id); if (!el) return;
  st.scrollEnabled = false;
  S.timeout(() => {
    const top = el.getBoundingClientRect().top + window.pageYOffset;
    if (st.lenis) st.lenis.scrollTo(top); else window.scrollTo({ top, behavior: 'smooth' });
    S.timeout(() => { st.scrollEnabled = true; }, 100);
  }, 50);
}

/**
 * The original removes a few nodes for good (the page loader once the intro is over, the colour-reveal canvas on
 * touch screens). Those nodes belong to React's tree, which must still find them when the page unmounts, so they are
 * taken out of the picture with display:none instead: nothing in the stylesheet depends on their presence.
 */
export function detach(el: HTMLElement | null | undefined): void {
  if (!el) return;
  el.style.display = 'none';
}

/** The scroll-lock state and the shared touch flag; resets everything when the page goes away. */
export function scrollLock(S: Scope): void {
  st.lenis = null; st.scrollEnabled = true; st.locks = 0; st.touching = false;
  S.on(window, 'touchstart', () => { st.touching = true; }, { passive: true, capture: true });
  S.on(window, 'touchend', () => { st.touching = false; }, { passive: true, capture: true });
  S.on(window, 'touchcancel', () => { st.touching = false; }, { passive: true, capture: true });
  window.scrollTo(0, 0);
  S.add(() => {
    st.locks = 0; st.scrollEnabled = true;
    root.style.removeProperty('position'); root.style.removeProperty('overflow'); root.style.removeProperty('height');
    for (const k of Object.keys(hooks) as (keyof typeof hooks)[]) delete hooks[k];
  });
}

/* ---------- adaptive grid scale-up above 1920px ---------- */
export function adaptiveGrid(S: Scope): void {
  function applyAdaptiveGrid() {
    const FONT_BASE = 16, baseWidth = 1920, coef = 0.6666;
    const w = window.innerWidth;
    const widthReduction = ((baseWidth - w) / baseWidth) * 100;
    const size = FONT_BASE - (FONT_BASE * (widthReduction * coef)) / 100;
    if (size > FONT_BASE) root.style.fontSize = size + 'px';
    else root.style.removeProperty('font-size');
  }
  applyAdaptiveGrid(); S.on(window, 'resize', applyAdaptiveGrid);
  S.add(() => root.style.removeProperty('font-size'));
}

/* ---------- spring helper (mass 1, semi-implicit Euler) ---------- */
export type Spring = { set(t: number): void };
export function spring(S: Scope, { tension, friction }: { tension: number; friction: number }, render: (x: number) => void): Spring {
  let x = 0, v = 0, target = 0, raf = 0;
  const step = () => {
    const dt = 1 / 60, a = tension * (target - x) - friction * v;
    v += a * dt; x += v * dt; render(x);
    if (Math.abs(target - x) < 0.001 && Math.abs(v) < 0.001) { x = target; v = 0; render(x); raf = 0; return; }
    raf = S.raf(step);
  };
  render(0);
  return { set(t) { target = t; if (!raf) raf = S.raf(step); } };
}

// declarative hovers: data-h="s 1 1.04|y 0 -2|o .8 1"  data-hs="tension friction"  data-ht="closest trigger"
const bound = new WeakSet<Element>();
export function bindHovers(S: Scope, scope: ParentNode = document): void {
  scope.querySelectorAll<HTMLElement>('[data-h]').forEach((el) => {
    if (bound.has(el)) return; bound.add(el);
    const props = el.dataset.h!.split('|').map((p) => { const [k, a, b] = p.trim().split(/\s+/); return { k, a: +a, b: +b }; });
    const [tension, friction] = (el.dataset.hs || '320 18').split(/\s+/).map(Number);
    const trig = el.dataset.ht ? el.closest(el.dataset.ht) || el : el;
    const render = (p: number) => {
      const v: Record<string, number> = { s: 1, x: 0, y: 0, r: 0 };
      let o: number | null = null;
      props.forEach(({ k, a, b }) => { const val = a + (b - a) * p; if (k === 'o') o = val; else v[k] = val; });
      el.style.transform = `translate(${v.x}px,${v.y}px) rotate(${v.r}deg) scale(${v.s})`;
      if (o !== null) el.style.opacity = String(o);
    };
    const s = spring(S, { tension, friction }, render);
    if (!canHover) return;
    trig.addEventListener('mouseenter', () => s.set(1));
    trig.addEventListener('mouseleave', () => s.set(0));
    trig.addEventListener('focusin', () => s.set(1));
    trig.addEventListener('focusout', () => s.set(0));
  });
}
