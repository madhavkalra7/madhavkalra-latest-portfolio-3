import type { Behavior, Scope } from '../../lib/scope';
import { $$ } from '../../lib/dom';

/* The ability card runs as its own document: the home page opens it in an iframe (/ability-card/) and the
   two talk over postMessage ({ holo: 'up' | 'progress' | 'ready' | 'fail' | 'close' }). */

declare global {
  interface Window {
    /** set by the engine: { ready: true, … } once the card is drawn, or { ready: false, error } */
    __holo?: { ready: boolean; error?: string };
    /** asset overrides the engine consults before its relative ./assets/ paths */
    __CARD_ASSETS?: Record<string, string | undefined>;
    /** Image constructor the engine uses for same-origin images it samples on a canvas */
    __threeuiStorageImage?: new (width?: number, height?: number) => HTMLImageElement;
    __SHRINE_MSAA?: number;
  }
}

/** portfolio bridge (runs before the engine): the scene, shaders and motion are the authored ones on every device.
    Only how many pixels it renders into is bounded, so a phone draws the same card rather than a cheaper one. */
function renderBudget(): void {
  const n = navigator as Navigator & { deviceMemory?: number };
  const mem = n.deviceMemory || 8, cores = n.hardwareConcurrency || 8;
  const weak = mem <= 4 || cores <= 4;
  const touch = /iPhone|iPad|Android/.test(n.userAgent) || (n.maxTouchPoints || 0) > 1;
  if (weak) window.__SHRINE_MSAA = 0; // no multisampling on a small machine
  const cap = Math.min(window.devicePixelRatio || 1, weak ? 1.5 : touch ? 2 : 2.5);
  try { Object.defineProperty(window, 'devicePixelRatio', { get: () => cap, configurable: true }); } catch { /* read-only in this browser */ }
  try {
    const c = document.createElement('canvas');
    if (!(c.getContext('webgl2') || c.getContext('webgl'))) throw new Error('no webgl');
  } catch {
    if (parent !== window) parent.postMessage({ holo: 'fail', why: 'webgl' }, '*');
  }
}

/** Images made through this constructor ask for CORS on same-origin URLs, so the engine can read their pixels. */
function storageImage(): void {
  window.__threeuiStorageImage = function StorageImage(width?: number, height?: number) {
    const image = new Image(width, height);
    const property = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src')!;
    Object.defineProperty(image, 'src', {
      configurable: true,
      get() { return property.get!.call(this); },
      set(value: string) {
        try {
          const url = new URL(value, document.baseURI);
          if (this.crossOrigin === null && url.origin === new URL(document.baseURI).origin) this.crossOrigin = 'anonymous';
        } catch { /* not a URL */ }
        property.set!.call(this, value);
      },
    });
    return image;
  } as unknown as new (width?: number, height?: number) => HTMLImageElement;
}

/** The card's textures live in /ability-card/assets/; resolve them absolutely so the page works at /ability-card too. */
function cardAssets(): void {
  window.__CARD_ASSETS = new Proxy({} as Record<string, string | undefined>, {
    get: (_, k) => (typeof k === 'string' && k.startsWith('assets/') ? '/ability-card/' + k : undefined),
  });
}

/** Start the three.js engine (it begins drawing as soon as it is evaluated). */
const engine: Behavior = async () => {
  await import('./engine/holoCard.js');
};

/** portfolio bridge: loading progress and readiness go to the page; Esc closes */
function bridge(S: Scope): void {
  const d = -(Date.now() % 2400) + 'ms';
  $$('.cl__shine').forEach((e) => { e.style.animationDelay = d; });
  if (window.parent === window) return;
  const say = (m: { holo?: string; p?: number; why?: string }) => { m.holo = m.holo || 'x'; parent.postMessage(m, '*'); };
  S.on(window, 'keydown', (e) => { if (e.key === 'Escape') say({ holo: 'close' }); });
  const fill = document.getElementById('ld-fill'), stage = document.getElementById('ld-stage');
  let last = -1, done = false;
  S.raf(() => { S.raf(() => { say({ holo: 'up' }); }); });
  const poll = S.interval(() => {
    if (stage && /could not/i.test(stage.textContent ?? '')) { clearInterval(poll); say({ holo: 'fail', why: 'engine' }); return; }
    const m = fill && /scaleX[(]([0-9.]+)[)]/.exec(fill.style.transform || ''); const p = m ? +m[1] : 0;
    if (p !== last) { last = p; say({ holo: 'progress', p }); }
    if (window.__holo && window.__holo.ready && !done) {
      done = true; clearInterval(poll); say({ holo: 'ready' });
      /* the card stays, fast or slow: nothing here measures it and swaps it out any more */
    }
  }, 120);
}

export const behaviors: Behavior[] = [renderBudget, storageImage, cardAssets, engine, bridge];
