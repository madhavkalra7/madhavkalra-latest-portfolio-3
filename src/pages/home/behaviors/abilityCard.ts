import type { Scope } from '../../../lib/scope';
import { $, $$, must } from '../../../lib/dom';
import { FOCUSABLE, startScroll, stopScroll } from './state';

type HoloMsg = { holo?: string; p?: number };

/* ---------- Ability card: the ThreeUI holo card where the device can carry it, a light CSS card where it can't ---------- */
export function abilityCard(S: Scope): void {
  const layer = $('#holo'), open = $('#holoOpen'), fig = must('#fig');
  if (!layer || !open) return;
  const SRC = '/ability-card/';
  const ld = must('#holoLd'), pct = must('#holoPct'), lite = must('#holoLite'), hc = must('#hc');
  // the ThreeUI card is the card, on every device. It may take a moment to load, and it is allowed to.
  // The layered CSS card below is kept for one case only: a browser with no WebGL at all, or an engine that fails outright.
  const hasGL = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; } })();
  let frame: HTMLIFrameElement | null = null, back: HTMLElement | null = null, timer = 0, isOpen = false, useLite = !hasGL, liteReady: Promise<unknown> | null = null, openT = 0, handing = false;
  const progress = (p: number) => { ld.style.setProperty('--p', String(p)); pct.textContent = Math.round(p * 100) + '%'; };
  // the light card's faces, decoded before it is shown so it never appears half-drawn
  // the faces are marked lazy so their weight never lands on a visit that gets the 3D card;
  // asking for them switches them on and waits for them to decode
  const decodeLite = () => liteReady || (liteReady = Promise.all($$<HTMLImageElement>('img', lite).map((im) => {
    im.loading = 'eager';
    return im.decode ? im.decode().catch(() => {}) : Promise.resolve();
  })));
  function showLite() {
    if (!isOpen) return;
    useLite = true; clearTimeout(timer);
    lite.hidden = false; lite.classList.remove('in');
    let creep = .1; const cr = S.interval(() => { creep = Math.min(.92, creep + (1 - creep) * .18); if (!ld.classList.contains('gone')) progress(creep); }, 140);
    decodeLite().then(() => {
      clearInterval(cr); if (S.dead || !isOpen) return;
      progress(1);
      S.timeout(() => {
        if (!isOpen) return;
        lite.classList.add('in'); ld.classList.add('out');
        hc.classList.remove('flip', 'live'); spin(true);
        S.timeout(() => { if (frame) { frame.remove(); frame = null; } }, 520);   // the 3D card leaves only once the light one covers it
        S.timeout(() => hc.focus({ preventScroll: true }), 360);
      }, Math.max(300, 950 - (performance.now() - openT)));   // the outline finishes drawing before the card replaces it
    });
  }
  function show() {
    if (isOpen) return; isOpen = true; openT = performance.now(); handing = false;
    back = document.activeElement as HTMLElement | null;
    layer!.hidden = false; stopScroll();
    ld.classList.remove('out', 'gone'); progress(0); lite.hidden = true; lite.classList.remove('in');
    { const d = -(Date.now() % 2400) + 'ms'; $$('.cl__shine').forEach((e) => { e.style.animationDelay = d; }); }
    S.raf(() => layer!.classList.add('on'));
    if (useLite) { showLite(); return; }
    frame = document.createElement('iframe');
    frame.title = "Madhav Kalra's ability card";
    frame.setAttribute('sandbox', 'allow-scripts');   // the claude.ai viewer only loads its own files into a same-origin frame
    frame.loading = 'eager';
    if (window.__ONEFILE && window.__ONEFILE.holo) frame.srcdoc = window.__ONEFILE.holo; else frame.src = SRC;
    layer!.appendChild(frame);
    // a long rope on the web, where everything the card needs sits next to it; shorter in the single
    // file, whose engine comes from the network and so can simply be out of reach
    timer = S.timeout(showLite, window.__ONEFILE ? 15000 : 45000);
  }
  function hide() {
    if (!isOpen) return; isOpen = false;
    clearTimeout(timer); spin(false); held = false; tx = ty = 0;
    layer!.classList.remove('on');
    const f = frame; frame = null;
    S.timeout(() => { f?.remove(); lite.hidden = true; lite.classList.remove('in'); layer!.hidden = true; }, 360);   // unmounted: nothing keeps rendering
    startScroll(); back?.focus?.({ preventScroll: true });
  }
  // the card's frame is appended inside #holo; take it out with the page
  S.add(() => { frame?.remove(); frame = null; });
  S.on(window, 'message', (e) => {
    const m: HoloMsg = e.data || {};
    if (!m.holo || !frame || e.source !== frame.contentWindow) return;   // only the card's own frame can talk to this layer
    if (m.holo === 'close') return hide();
    if (!frame || !isOpen || useLite) return;
    // the frame now draws the same loader itself: show it and step aside, with no visible change
    if ((m.holo === 'up' || m.holo === 'progress') && !frame.classList.contains('up') && !handing) {
      handing = true; const f = frame;                                      // after the loader's own entrance has settled
      S.timeout(() => { if (frame !== f || useLite) return; f.classList.add('up'); S.raf(() => { if (frame === f && !useLite) ld.classList.add('gone'); }); }, Math.max(0, 680 - (performance.now() - openT)));
    }
    if (m.holo === 'progress') progress(Math.max(.02, m.p || 0));
    if (m.holo === 'ready') { clearTimeout(timer); S.timeout(() => frame && frame.focus(), 400); }
    if (m.holo === 'fail') { ld.classList.remove('gone'); ld.classList.add('out'); showLite(); }   // the engine could not start at all: the layered card takes over
  });
  // warm the card's images in the background once the page is idle, so opening it is instant
  const idle = () => { if (S.dead) return; if (useLite) decodeLite(); };
  if ('requestIdleCallback' in window) { const id = requestIdleCallback(idle, { timeout: 4000 }); S.add(() => cancelIdleCallback(id)); }
  else S.timeout(idle, 2500);

  /* the card's motion: it leans toward the pointer, follows a finger, answers the phone's own tilt,
     and keeps a slow sway of its own when nobody is touching it. One loop, only while the card is up. */
  const RX = 11, RY = 14;
  const calm = matchMedia('(prefers-reduced-motion:reduce)');
  let tx = 0, ty = 0, cx = 0, cy = 0, held = false, loop = 0, t0 = 0;
  function step(now: number) {
    const sway = (held || calm.matches) ? 0 : 1;
    const t = (now - t0) / 1000;
    cx += ((tx + sway * Math.sin(t * .62) * .34) - cx) * .12;
    cy += ((ty + sway * Math.sin(t * .47 + 1.1) * .22) - cy) * .12;
    const st = hc.style;
    st.setProperty('--px', cx.toFixed(4)); st.setProperty('--py', cy.toFixed(4));
    st.setProperty('--ry', (cx * RY).toFixed(2) + 'deg'); st.setProperty('--rx', (-cy * RX).toFixed(2) + 'deg');
    st.setProperty('--lift', Math.min(1, Math.hypot(cx, cy) * 1.3).toFixed(3));
    loop = S.raf(step);
  }
  const spin = (on: boolean) => { cancelAnimationFrame(loop); loop = 0; if (on) { t0 = performance.now(); loop = S.raf(step); } };
  const clamp = (v: number) => Math.max(-1, Math.min(1, v));
  lite.addEventListener('pointermove', (e) => {
    const r = hc.getBoundingClientRect(); if (!r.width) return;
    const u = (e.clientX - r.left) / r.width, v = (e.clientY - r.top) / r.height;
    if (u < -.4 || u > 1.4 || v < -.35 || v > 1.35) { held = false; tx = ty = 0; return; }
    held = true; hc.classList.add('live'); tx = clamp((u - .5) * 2); ty = clamp((v - .5) * 2);
  }, { passive: true });
  lite.addEventListener('pointerleave', () => { held = false; tx = ty = 0; });
  // a tap flips it; a drag only turns it
  let from: [number, number] | null = null;
  hc.addEventListener('pointerdown', (e) => { from = [e.clientX, e.clientY]; try { hc.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ } });
  hc.addEventListener('pointerup', (e) => {
    if (from && Math.hypot(e.clientX - from[0], e.clientY - from[1]) < 9) hc.classList.toggle('flip');
    from = null;
  });
  hc.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hc.classList.toggle('flip'); } });
  // phones that report their own tilt move the card without a finger on it
  S.on(window, 'deviceorientation', (e) => {
    if (held || e.gamma == null || !isOpen) return;
    tx = clamp(e.gamma / 28); ty = clamp(((e.beta == null ? 45 : e.beta) - 45) / 30);
  });
  S.on(document, 'visibilitychange', () => { if (document.hidden) spin(false); else if (isOpen && useLite) spin(true); });
  S.on(open, 'click', (e) => { e.stopPropagation(); show(); });
  S.on(fig, 'click', (e) => { if (!(e.target as Element).closest('.fig__card')) show(); });
  S.on(must('#holoClose'), 'click', hide);
  S.on(window, 'keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') return hide();
    if (e.key !== 'Tab') return;
    // the card layer covers the page, so Tab stays on the card and its close button
    const f = $$(FOCUSABLE, layer).filter((n) => n.offsetWidth || n.offsetHeight || n.getClientRects().length);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (!layer.contains(document.activeElement)) { e.preventDefault(); first.focus(); return; }
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}
