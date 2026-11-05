import type { Scope } from '../../lib/scope';
import { must, selfOrigin } from '../../lib/dom';
import { PHOTOS } from './photos';

declare global {
  // the original exposed the computed rows for debugging; kept (nothing else reads it)
  interface Window { __rows?: Row[] }
}

interface Cell { s: number; x: number; y: number; w: number; h: number }
interface Row { y: number; H: number; L: number; off: number; cells: Cell[] }
interface Item { s: number; r: number; w: number; h: number; c: string | number }
interface PatchCell { s: number; c: string | number; x: number; y: number; w: number; h: number }

/**
 * The photo wall: an endless field of photos you drag through in any direction, with inertia, a parallax star sky,
 * a lightbox, and (inside the home page's door, `?embed`) the enter / exit / reset / mode messages from the parent.
 *
 * The layout depends on the viewport (rebuilt on every resize) and the cells are virtualised (only what is on screen
 * exists, recycled from a pool as you move), so the markup stays imperative: the cells live inside #space.
 */
export function wall(S: Scope): void {
  const EMBED = /[?&]embed\b/.test(location.search);   // running inside the home page, behind the door
  const P = PHOTOS;
  const N = P.length;
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wall = must<HTMLDivElement>('#wall'), space = must<HTMLDivElement>('#space');
  // the classes this script puts on <html> must not outlive the page
  S.add(() => { root.classList.remove('pre', 'out', 'instant'); delete window.__rows; });

  let booted = false, arriving = true;

  /* ---- layout: identical rules to make_wall.py, so the door's glimpse matches the first frame ---- */
  /* ---- layout: rows of equal height, so wide and tall photos read at a similar size.
     A patch of rows is built once and repeats endlessly in every direction. ---- */
  let vw = 0, vh = 0, g = 0, PW = 0, PH = 0, patch: PatchCell[] = [], ROWS: Row[] | null = null;
  /* photos run in rows of the same orientation, each row its own endless strip, so the gaps
     between neighbours are the same everywhere; sizes are the same as before */
  function buildRows(): void {
    const mobile = vw < 640;
    const side = (mobile ? vw * .56 : Math.min(380, vh * .44)) * .93;   // same apparent size as before (the depth scale is gone)
    const A = side * side, minLen = vw * (mobile ? 2 : 1.7);            // rows long enough that no photo shows twice at once
    const all: Item[] = P.map((p, s) => { const r = p.w / p.h, w = Math.sqrt(A * r); return { s, r, w, h: w / r, c: p.c || s }; });
    const groups = [all.filter((o) => o.r < 1), all.filter((o) => o.r >= 1)].filter((gr) => gr.length);
    const made: Item[][][] = [];
    for (const gr of groups) {
      gr.sort((a, b) => a.r - b.r);                    // similar shapes share a row, so their heights match
      const total = gr.reduce((a, o) => a + o.w + g, 0);
      const n = Math.max(1, Math.min(gr.length, mobile ? Math.floor(total / minLen) : Math.round(total / minLen)));
      // similar shapes share a row (so heights match), but a row avoids holding two from the same series
      const target = total / n, rowsOfGroup: Item[][] = Array.from({ length: n }, () => []), len: number[] = new Array(n).fill(0);
      let cum = 0;
      for (const o of gr) {
        const nat = Math.min(n - 1, Math.floor(cum / target)); cum += o.w + g;
        const cand = [...Array(n).keys()].sort((p, q) => Math.abs(p - nat) - Math.abs(q - nat));
        const score = (k: number) => (rowsOfGroup[k].filter((x) => x.c === o.c).length * 3) + Math.abs(k - nat) + (len[k] + o.w > target * 1.18 ? 9 : 0);
        const k = cand.reduce((best, k2) => score(k2) < score(best) ? k2 : best, cand[0]);
        rowsOfGroup[k].push(o); len[k] += o.w + g;
      }
      made.push(rowsOfGroup);
    }
    // interleave tall and wide rows evenly
    const [a = [], b = []] = made, seq: Item[][] = [];
    let ia = 0, ib = 0;
    while (ia < a.length || ib < b.length) {
      if (ib >= b.length || (ia < a.length && ia / a.length <= ib / b.length)) seq.push(a[ia++]); else seq.push(b[ib++]);
    }
    const rows: Row[] = []; let y = 0;
    seq.filter((r) => r.length).forEach((items, ri) => {
      // order within the row so neighbours come from different series where possible
      let ord: Item[] = items, bestBad = 1e9;
      for (let tries = 0; tries < 40 && bestBad > 0; tries++) {
        const left = items.slice(), o2: Item[] = [];
        if (tries) left.push(...left.splice(0, tries % left.length));    // try different starting points
        while (left.length) {
          const prev = o2[o2.length - 1];
          let k = left.findIndex((o) => !prev || o.c !== prev.c);
          if (k < 0) k = 0;
          o2.push(left.splice(k, 1)[0]);
        }
        let bad = 0; for (let k = 0; k < o2.length; k++) if (o2.length > 1 && o2[k].c === o2[(k + 1) % o2.length].c) bad++;
        if (bad < bestBad) { bestBad = bad; ord = o2; }
      }
      const H = Math.max(...ord.map((o) => o.h));
      let x = 0; const cells = ord.map((o) => { const c = { s: o.s, x, y: (H - o.h) / 2, w: o.w, h: o.h }; x += o.w + g; return c; });
      rows.push({ y, H, L: x, off: ((ri * 0.381966) % 1) * x, cells });
      y += H + g;
    });
    ROWS = rows;
    PH = y; PW = Math.max(...rows.map((r) => r.L)); patch = [];
    window.__rows = rows;
  }
  function build(): void {
    vw = innerWidth; vh = innerHeight;
    g = vw >= 640 ? 30 : 16;
    buildRows();
  }
  /* The original build() continued, after an early `return`, with the previous layout (a masonry "patch" packed
     where the skyline is lowest). That code never ran on the live site; it is kept here, unused, for reference. */
  function buildMasonry(): void {
    ROWS = null;
    // every photo keeps its real proportions and gets about the same amount of space,
    // so tall and wide shots are equally easy to see
    const A = vw >= 640 ? Math.pow(Math.min(380, vh * .44), 2) : Math.pow(vw * .56, 2);
    const rest: { s: number; w: number; h: number; c: string | number }[] = [];
    for (let s = 0; s < N; s++) {                                  // each photo once per block: never next to itself
      const p = P[s], r = p.w / p.h, w = Math.sqrt(A * r);
      rest.push({ s, w, h: w / r, c: p.c || s });
    }
    // pack them like a masonry wall: each photo goes where the skyline is lowest
    PW = Math.max(vw * 1.15, Math.sqrt(rest.reduce((a, b) => a + (b.w + g) * (b.h + g), 0) * 1.6));
    const sky = [{ x: 0, w: PW, y: 0 }];
    patch = [];
    const spot = (it: { w: number }) => {
      let best: { x: number; y: number } | null = null;
      for (let i = 0; i < sky.length; i++) {
        const x = sky[i].x; if (x + it.w > PW) break;
        let y = 0, span = 0, j = i;
        while (span < it.w + g && j < sky.length) { y = Math.max(y, sky[j].y); span += sky[j].w; j++; }
        if (span < it.w + g && x + it.w + g > PW) continue;
        if (!best || y < best.y) best = { x, y };
      }
      return best || { x: 0, y: Math.max(...sky.map((s) => s.y)) };
    };
    // how many photos from the same series would sit right beside this spot (wrapping sideways too)
    const near = (it: { w: number; h: number; c: string | number }, at: { x: number; y: number }) => {
      let n = 0; const R = g * 3;
      for (const q of patch) {
        if (q.c !== it.c) continue;
        for (const off of [-PW, 0, PW]) {
          const gx = Math.max(q.x + off - (at.x + it.w), at.x - (q.x + off + q.w)), gy = Math.max(q.y - (at.y + it.h), at.y - (q.y + q.h));
          if (gx < R && gy < R) { n++; break; }
        }
      }
      return n;
    };
    while (rest.length) {
      // the next photo is the first one whose series isn't already right there
      let pick = 0, at = spot(rest[0]), sc = near(rest[0], at);
      for (let k = 1; k < rest.length && sc > 0; k++) {
        const a2 = spot(rest[k]), s2 = near(rest[k], a2);
        if (s2 < sc) { pick = k; at = a2; sc = s2; }
      }
      const it = rest.splice(pick, 1)[0], best = at;
      patch.push({ s: it.s, c: it.c, x: best.x, y: best.y, w: it.w, h: it.h });
      // raise the skyline under the new photo
      const L = best.x, R = Math.min(PW, best.x + it.w + g), top = best.y + it.h + g, next: { x: number; w: number; y: number }[] = [];
      for (const s of sky) {
        if (s.x + s.w <= L || s.x >= R) { next.push(s); continue; }
        if (s.x < L) next.push({ x: s.x, w: L - s.x, y: s.y });
        if (s.x + s.w > R) next.push({ x: R, w: s.x + s.w - R, y: s.y });
      }
      next.push({ x: L, w: R - L, y: top });
      next.sort((a, b) => a.x - b.x);
      sky.length = 0; sky.push(...next);
    }
    PH = Math.max(...sky.map((s) => s.y));
  }
  void buildMasonry;
  const mod = (a: number, b: number) => ((a % b) + b) % b;
  /* ---- camera with inertia ---- */
  let camX = 0, camY = 0, vx = 0, vy = 0, dragging = false, moved = 0, lastT = 0;
  function centre(): void { camX = PW * .3; camY = PH * .25; }

  /* ---- virtualised cells: only what's on screen exists in the DOM ---- */
  const live = new Map<string, HTMLDivElement>(), pool: HTMLDivElement[] = [];
  const parts = (el: HTMLDivElement) => {
    const fl = el.firstChild as HTMLDivElement, ph = fl.firstChild as HTMLDivElement;
    return { fl, ph, im: ph.firstChild as HTMLImageElement };
  };
  function cellFor(key: string, s: number): HTMLDivElement {
    let el = live.get(key);
    if (el) return el;
    el = pool.pop() || (() => {
      const d = document.createElement('div'); d.className = 'cell';
      d.innerHTML = '<div class="fl"><div class="ph"><img alt="" draggable="false" decoding="async"></div></div>';
      const im = d.querySelector('img')!; im.onload = () => im.classList.add('ok');
      space.appendChild(d); return d;
    })();
    const { fl, ph, im } = parts(el), p = P[s];
    if (el.dataset.k !== key) {
      // each placement gets its own depth and its own slow drift
      el.dataset.k = key;
      const r = (n: string) => { let h = 2166136261; for (const ch of key + n) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return ((h >>> 0) % 1000) / 1000; };
      const z = ROWS ? 1 : .86 + r('z') * .14;
      ph.style.setProperty('--z', z.toFixed(3));
      const amp = ROWS ? .25 : 1;
      fl.style.setProperty('--fx', ((r('x') - .5) * 14 * amp).toFixed(1) + 'px');
      fl.style.setProperty('--fy', ((r('y') - .5) * 18 * amp).toFixed(1) + 'px');
      fl.style.setProperty('--fr', ((r('r') - .5) * 1.4 * amp).toFixed(2) + 'deg');
      fl.style.setProperty('--fd', (10 + r('d') * 8).toFixed(1) + 's');
      fl.style.setProperty('--fdl', (-r('l') * 18).toFixed(1) + 's');
    }
    if (el.dataset.s !== String(s)) {
      el.dataset.s = String(s);
      ph.style.backgroundImage = `url(${p.t}),url(${p.q})`;  // cached photo paints at once; blurred placeholder underneath
      im.classList.remove('ok'); im.src = p.t;
      if (im.complete && im.naturalWidth) im.classList.add('ok');
      else if (!booted) im.decoding = 'sync';
    }
    el.style.display = '';
    live.set(key, el);
    return el;
  }
  function render(): void {
    const seen = new Set<string>();
    if (ROWS) {
      const iy0 = Math.floor((camY - 400) / PH), iy1 = Math.floor((camY + vh) / PH);
      for (let iy = iy0; iy <= iy1; iy++) ROWS.forEach((row, ri) => {
        const ry = row.y + iy * PH - camY;
        if (ry + row.H < -40 || ry > vh + 40) return;
        const base = camX + row.off;
        const ix0 = Math.floor((base - 400) / row.L), ix1 = Math.floor((base + vw) / row.L);
        for (let ix = ix0; ix <= ix1; ix++) row.cells.forEach((c, k) => {
          const x = c.x + ix * row.L - base, y = ry + c.y;
          if (x + c.w < -40 || x > vw + 40) return;
          const key = `${ix}:${iy}:${ri}:${k}`;
          const el = cellFor(key, c.s);
          el.style.width = c.w + 'px'; el.style.height = c.h + 'px';
          el.style.transform = `translate3d(${x}px,${y}px,0)`;
          if (arriving) { const d = Math.hypot(x + c.w / 2 - vw / 2, y + c.h / 2 - vh / 2) / Math.hypot(vw / 2, vh / 2);
            parts(el).ph.style.setProperty('--dl', (d * .22 + (seen.size % 5) * .02).toFixed(3) + 's'); }
          seen.add(key);
        });
      });
      for (const [key, el] of live) if (!seen.has(key)) { live.delete(key); el.style.display = 'none'; pool.push(el); }
      return;
    }
    const ix0 = Math.floor((camX - 400) / PW), ix1 = Math.floor((camX + vw) / PW);
    const iy0 = Math.floor((camY - 400) / PH), iy1 = Math.floor((camY + vh) / PH);
    for (let ix = ix0; ix <= ix1; ix++) for (let iy = iy0; iy <= iy1; iy++) {
      for (let k = 0; k < patch.length; k++) {
        const c = patch[k];
        const x = c.x + ix * PW - camX, y = c.y + iy * PH - camY;
        if (x + c.w < -40 || x > vw + 40 || y + c.h < -40 || y > vh + 40) continue;
        const key = `${ix}:${iy}:${k}`;
        const el = cellFor(key, c.s);
        el.style.width = c.w + 'px'; el.style.height = c.h + 'px';
        el.style.transform = `translate3d(${x}px,${y}px,0)`;
        if (arriving) { const d = Math.hypot(x + c.w / 2 - vw / 2, y + c.h / 2 - vh / 2) / Math.hypot(vw / 2, vh / 2);
          parts(el).ph.style.setProperty('--dl', (d * .22 + (seen.size % 5) * .02).toFixed(3) + 's'); }
        seen.add(key);
      }
    }
    for (const [key, el] of live) if (!seen.has(key)) { live.delete(key); el.style.display = 'none'; pool.push(el); }
  }


  let tiltX = 0, tiltY = 0, mvx = 0, mvy = 0;
  /* ---- deep space behind the wall: far stars and faint haze, drifting slowly as you move (parallax) ---- */
  const sky = must<HTMLCanvasElement>('#sky'), sx = sky.getContext('2d')!;
  const TILE = 1600;
  const STARS: { x: number; y: number; a: number; s: number; w: boolean }[] = [];
  const NEB: { x: number; y: number; r: number; c: string; a: number }[] = [];
  (function seed() {
    let a = 987654321;
    const rnd = () => (a = Math.imul(a ^ (a >>> 15), 2246822507) ^ Math.imul(a ^ (a >>> 13), 3266489909), ((a >>> 0) % 1e6) / 1e6);
    for (let i = 0; i < 520; i++) { const m = Math.pow(rnd(), 3.2); STARS.push({ x: rnd() * TILE, y: rnd() * TILE, a: .2 + m * .75, s: .7 + m * 1.5, w: rnd() < .12 }); }
    const tones = ['196,176,176', '107,92,92', '150,128,140', '120,110,150'];
    for (let i = 0; i < 6; i++) NEB.push({ x: rnd() * TILE, y: rnd() * TILE, r: 260 + rnd() * 380, c: tones[i % 4], a: .07 + rnd() * .07 });
  })();
  function sizeSky(): void { const dpr = Math.min(devicePixelRatio || 1, 2); sky.width = Math.round(innerWidth * dpr); sky.height = Math.round(innerHeight * dpr); sx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  let skyX = NaN, skyY = NaN;
  function drawSky(): void {
    const ox = camX * .12, oy = camY * .12;
    if (ox === skyX && oy === skyY) return; skyX = ox; skyY = oy;
    const w = innerWidth, h = innerHeight;
    sx.globalCompositeOperation = 'source-over'; sx.fillStyle = '#030306'; sx.fillRect(0, 0, w, h);
    sx.globalCompositeOperation = 'lighter';
    const hx = camX * .06, hy = camY * .06;          // haze is further away still
    for (const n of NEB) for (let ix = -1; ix <= Math.ceil(w / TILE); ix++) for (let iy = -1; iy <= Math.ceil(h / TILE); iy++) {
      const x = mod(n.x - hx, TILE) + ix * TILE, y = mod(n.y - hy, TILE) + iy * TILE;
      if (x + n.r < 0 || y + n.r < 0 || x - n.r > w || y - n.r > h) continue;
      const g = sx.createRadialGradient(x, y, 0, x, y, n.r);
      g.addColorStop(0, `rgba(${n.c},${n.a})`); g.addColorStop(.45, `rgba(${n.c},${n.a * .45})`); g.addColorStop(1, `rgba(${n.c},0)`);
      sx.fillStyle = g; sx.fillRect(x - n.r, y - n.r, n.r * 2, n.r * 2);
    }
    for (const s of STARS) {
      const x0 = mod(s.x - ox, TILE), y0 = mod(s.y - oy, TILE);
      for (let x = x0; x < w; x += TILE) for (let y = y0; y < h; y += TILE) {
        sx.fillStyle = s.w ? `rgba(255,236,220,${s.a})` : `rgba(226,230,255,${s.a})`; sx.fillRect(x, y, s.s, s.s);
      }
    }
  }

  function tick(t: number): void {
    const dt = Math.min(48, t - (lastT || t)) / 16.67; lastT = t;
    // the whole field leans a little in the direction you move it, as if it has mass
    const sx = dragging ? mvx : vx, sy = dragging ? mvy : vy;
    const txT = Math.max(-5, Math.min(5, sy * .35)), tyT = Math.max(-5, Math.min(5, -sx * .35));
    tiltX += (txT - tiltX) * .08 * dt; tiltY += (tyT - tiltY) * .08 * dt;
    mvx *= .85; mvy *= .85;
    if (!reduced) space.style.transform = `rotateX(${tiltX.toFixed(3)}deg) rotateY(${tiltY.toFixed(3)}deg)`;
    if (!dragging && (Math.abs(vx) > .05 || Math.abs(vy) > .05)) {
      camX += vx * dt; camY += vy * dt;
      const f = Math.pow(.94, dt); vx *= f; vy *= f;
      render();
    }
    drawSky();
    S.raf(tick);
  }

  /* ---- lightbox (the only place full-size photos load) ---- */
  const lb = must('#lb'), lbImg = must<HTMLImageElement>('#lbImg');
  const lbClose = must<HTMLButtonElement>('#lbClose'), lbCount = must('#lbCount');
  const back = must<HTMLAnchorElement>('#back'), hint = must('#hint');
  let hinted = false;
  function hideHint(): void { if (!hinted) { hinted = true; hint.classList.add('gone'); } }

  /* ---- input: drag (mouse/touch/pen), wheel/trackpad, keys ---- */
  let px = 0, py = 0, downX = 0, downY = 0, samples: { x: number; y: number; t: number }[] = [];
  const cellAt = (x: number, y: number) =>
    document.elementsFromPoint(x, y).map((n) => n.closest<HTMLElement>('.cell')).find(Boolean);
  S.on(wall, 'pointerdown', (e) => {
    if (e.button !== 0) return;
    dragging = true; moved = 0; vx = vy = 0; px = downX = e.clientX; py = downY = e.clientY; samples = [{ x: px, y: py, t: e.timeStamp }];
    wall.setPointerCapture(e.pointerId); wall.classList.add('drag'); hideHint();
  });
  S.on(wall, 'pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - px, dy = e.clientY - py; px = e.clientX; py = e.clientY;
    camX -= dx; camY -= dy; mvx = -dx; mvy = -dy; moved = Math.max(moved, Math.hypot(px - downX, py - downY));
    samples.push({ x: px, y: py, t: e.timeStamp }); if (samples.length > 6) samples.shift();
    render();
  });
  const end = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false; wall.classList.remove('drag');
    const a = samples[0], b = samples[samples.length - 1], dt = Math.max(1, b.t - a.t);
    if (b.t - a.t < 120 && !reduced) { vx = -(b.x - a.x) / dt * 16.67; vy = -(b.y - a.y) / dt * 16.67; }
    if (moved < 6) {
      const hit = cellAt(e.clientX, e.clientY);
      if (hit) openLb(+hit.dataset.s!);
    }
  };
  S.on(wall, 'pointerup', end);
  S.on(wall, 'pointercancel', end);
  S.on(window, 'wheel', (e) => {
    if (!lb.hidden) return;
    e.preventDefault();
    let dx = e.deltaX, dy = e.deltaY;
    if (e.deltaMode === 1) { dx *= 32; dy *= 32; }
    if (e.shiftKey && !dx) { dx = dy; dy = 0; }
    camX += dx; camY += dy; vx = vy = 0; render(); hideHint();
  }, { passive: false });
  S.on(window, 'keydown', (e) => {
    if (!lb.hidden) {
      if (e.key === 'Escape') closeLb(); else if (e.key === 'ArrowRight') step(1); else if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'Tab') {
        // Tab stays inside the open lightbox instead of walking onto the gallery behind it
        const f = [...lb.querySelectorAll<HTMLElement>('button,a[href],[tabindex]:not([tabindex="-1"])')].filter((n) => n.offsetWidth || n.offsetHeight || n.getClientRects().length);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (!lb.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
        else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
      return;
    }
    const s = 22, m = ({ ArrowLeft: [-s, 0], ArrowRight: [s, 0], ArrowUp: [0, -s], ArrowDown: [0, s] } as Record<string, [number, number]>)[e.key];
    if (m) { e.preventDefault(); vx += m[0] * .5; vy += m[1] * .5; hideHint(); }
    // the photos can only be clicked, so the keyboard opens whichever one sits in the middle of the screen
    if ((e.key === 'Enter' || e.key === ' ') && document.activeElement === wall) {
      e.preventDefault();
      const hit = cellAt(innerWidth / 2, innerHeight / 2);
      if (hit) openLb(+hit.dataset.s!); else hideHint();
    }
    if (e.key === 'Escape') leave();
  });

  let cur = 0;
  function show(i: number): void {
    cur = mod(i, N); const p = P[cur];
    lbImg.src = p.t;                                       // instant (cached thumbnail) ...
    const full = new Image(); full.decoding = 'async'; full.src = p.f;
    full.onload = () => { if (!S.dead && cur === mod(i, N)) lbImg.src = p.f; };   // ... then the sharp one
    lbImg.alt = `Photo ${cur + 1} of ${N}`;
    lbCount.textContent = `${cur + 1} / ${N}`;
    new Image().src = P[mod(cur + 1, N)].f;                // warm the next one
  }
  function openLb(i: number): void { show(i); lb.hidden = false; S.raf(() => lb.classList.add('open')); lbClose.focus(); }
  function closeLb(): void { lb.classList.remove('open'); S.timeout(() => { lb.hidden = true; wall.focus(); }, 300); }
  const step = (d: number) => show(cur + d);
  S.on(lbClose, 'click', closeLb);
  S.on(must('#lbPrev'), 'click', () => step(-1));
  S.on(must('#lbNext'), 'click', () => step(1));
  S.on(lb, 'click', (e) => { if (e.target === lb) closeLb(); });

  function leave(): void {
    if (EMBED) parent.postMessage({ wall: 'close' }, selfOrigin());
    else location.href = back.href;
  }
  S.on(back, 'click', (e) => { if (EMBED) { e.preventDefault(); leave(); } });
  S.on(window, 'message', (e: MessageEvent) => {
    const m = (e.data || {}) as { wall?: string; mode?: string };
    if (e.source !== parent) return;
    if (m.wall === 'mode') { if (m.mode === 'dark') root.dataset.mode = 'dark'; else delete root.dataset.mode; }
    if (m.wall === 'enter') { arrive(); hinted = false; hint.classList.remove('gone'); S.timeout(hideHint, 6000); wall.focus({ preventScroll: true }); }
    if (m.wall === 'exit') { root.classList.add('out'); }
    if (m.wall === 'reset') {
      if (!lb.hidden) { lb.hidden = true; lb.classList.remove('open'); }
      root.classList.add('instant', 'pre'); root.classList.remove('out');
      vx = vy = 0; centre(); arriving = true; render();
      S.raf(() => root.classList.remove('instant'));
    }
  });
  S.timeout(hideHint, 6000);

  S.on(window, 'resize', () => { sizeSky(); skyX = NaN; const cx = camX + vw / 2, cy = camY + vh / 2; build(); camX = cx - vw / 2; camY = cy - vh / 2; render(); });

  sizeSky(); build(); centre(); render(); booted = true;
  S.raf(tick);
  // the photos come forward out of the dark, nearest the middle first
  function arrive(): void {
    arriving = false;
    root.classList.remove('instant');
    S.raf(() => S.raf(() => root.classList.remove('pre')));
  }
  const firstImgs = [...space.querySelectorAll<HTMLImageElement>('.cell img')];
  const decoded = Promise.race([
    Promise.all(firstImgs.map((im) => im.decode?.().then(() => im.classList.add('ok')).catch(() => {}))),
    new Promise<void>((r) => { S.timeout(r, 1500); }),
  ]);
  if (!EMBED) { decoded.then(() => { if (!S.dead) arrive(); }); wall.focus({ preventScroll: true }); }
}
