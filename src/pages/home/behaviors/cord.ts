import type { Scope } from '../../../lib/scope';
import { must } from '../../../lib/dom';
import { hooks, reduced, root } from './state';

type P = { x: number; y: number };
type Pt = P & { px: number; py: number; w: number };
type Sample = P & { tx: number; ty: number };

/* ---------- Pull cord: verlet rope you can grab, swing and pull ----------
   The rope hangs from above the top edge. Pulling it past the switch's spring travel
   clicks the switch (toggles the mode) the way a ceiling pull-cord does; letting go
   lets the spring snap the cord back up and the rope settles under gravity. */
export function pullCord(S: Scope): void {
  const wrap = must('#cord'), cv = must<HTMLCanvasElement>('.cord__cv', wrap), hit = must('#cordHit');
  const ctx = cv.getContext('2d')!;
  const N = 26;                         // segments
  const G = 4600;                       // gravity, px/s² (tuned so a ~30 cm cord swings at a lifelike ~1.2 s period)
  const STEP = 1 / 120;                 // fixed physics step
  const ITER = 16;                      // constraint passes
  let dpr = 1, W = 300, H = 500;
  let L = 220, EXT_MAX = 46, HIDDEN = 70, seg = 10, ax = 200, thick = 3.2, knobS = 1;
  const pts: Pt[] = [];                 // {x,y,px,py,w}
  let ext = 0, extV = 0, armed = true;
  let grab = -1, grabOff: P = { x: 0, y: 0 }, target: P | null = null, ptr: P | null = null, ptrPrev: P | null = null;
  let downAt = 0, downPos: P = { x: 0, y: 0 }, moved = 0;
  let acc = 0, lastT = 0, t = 0;
  let dropped = false, live = false;

  function layout() {
    const rem = parseFloat(getComputedStyle(root).fontSize) || 16;
    const vw = innerWidth, vh = innerHeight;
    let offset: number;                  // anchor distance from the viewport's right edge
    if (vw >= 1024) { offset = 4.25 * rem; L = Math.min(270, Math.max(190, vh * .3)); EXT_MAX = 72; thick = 3.7; knobS = 1.3; }
    else if (vw >= 640) { offset = 5.9 * rem; L = Math.min(220, Math.max(160, vh * .2)); EXT_MAX = 62; thick = 3.4; knobS = 1.2; }
    else { offset = 5.7 * rem; L = 70; EXT_MAX = 54; thick = 3.1; knobS = 1.1; }
    HIDDEN = EXT_MAX + 18;
    W = Math.min(vw, 340);
    H = Math.round(L + EXT_MAX + 170);
    wrap.style.height = H + 'px';
    dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    // small screens: hang just left of the local-time badge
    const ck = document.querySelector<HTMLElement>('.hdr .clock');
    if (ck && ck.offsetWidth) {
      // desktop: hang right beside the local-time badge; small screens: near the right edge (over the badge is fine)
      offset = vw >= 1200 ? Math.max(1.2 * rem, vw - ck.getBoundingClientRect().right - 1.4 * rem) : 2.4 * rem;
    }
    const newAx = W - offset;
    const total = L + HIDDEN;
    seg = total / N;
    if (!pts.length) {
      for (let i = 0; i <= N; i++) {
        const x = newAx, y = -HIDDEN + i * seg;
        pts.push({ x, y, px: x, py: y, w: i === 0 ? 0 : i === N ? .28 : 1 });
      }
    } else {
      const dx = newAx - ax;
      for (const p of pts) { p.x += dx; p.px += dx; }
    }
    ax = newAx;
  }

  /* ----- physics ----- */
  function step(dt: number) {
    if (!dropped) return;
    t += dt;
    // switch spring (anchor travel) — free when nobody is pulling
    if (grab < 0) {
      const K = 760, C = 21;
      extV += (-K * ext - C * extV) * dt;
      ext += extV * dt;
    }
    if (ext > EXT_MAX * .8 && armed && live) { armed = false; hooks.toggleMode?.(); try { navigator.vibrate?.(12); } catch { /* not allowed */ } }
    if (ext < EXT_MAX * .22) armed = true;

    const a = pts[0];
    a.x = a.px = ax; a.y = a.py = -HIDDEN + ext;

    const wind = reduced ? 0 : (Math.sin(t * .63) * 16 + Math.sin(t * 1.71 + 1.3) * 7);
    const damp = grab >= 0 ? .992 : .9875;
    for (let i = 1; i <= N; i++) {
      if (i === grab) continue;
      const p = pts[i];
      const vx = (p.x - p.px) * damp, vy = (p.y - p.py) * damp;
      p.px = p.x; p.py = p.y;
      p.x += vx + wind * dt * dt * (i / N);
      p.y += vy + G * dt * dt;
    }
    if (grab >= 0 && target) {
      const g = pts[grab];
      g.px = g.x; g.py = g.y;
      g.x = target.x; g.y = target.y;
    }
    for (let k = 0; k < ITER; k++) {
      for (let i = 0; i < N; i++) {
        const p1 = pts[i], p2 = pts[i + 1];
        const w1 = (i === grab) ? 0 : p1.w, w2 = (i + 1 === grab) ? 0 : p2.w;
        const sw = w1 + w2; if (!sw) continue;
        const dx = p2.x - p1.x, dy = p2.y - p1.y;
        const d = Math.hypot(dx, dy) || 1e-6;
        const diff = (d - seg) / d / sw;
        p1.x += dx * diff * w1; p1.y += dy * diff * w1;
        p2.x -= dx * diff * w2; p2.y -= dy * diff * w2;
      }
    }
    // keep the knob inside the drawing area
    for (let i = 1; i <= N; i++) {
      const p = pts[i];
      if (p.x < 14) { p.x = 14; } else if (p.x > W - 14) { p.x = W - 14; }
      if (p.y > H - 46) { p.y = H - 46; }
    }
  }

  // while dragging: the pointer sets the grabbed point; the switch spring gives way
  function updateDrag() {
    if (grab < 0 || !ptr) return;
    let tx = ptr.x - grabOff.x, ty = ptr.y - grabOff.y;
    const bx = ax, by = -HIDDEN;
    const reach = grab * seg;                         // rope length from switch to grabbed point
    const dx = tx - bx, dy = ty - by, d = Math.hypot(dx, dy) || 1e-6;
    let need = d - reach;
    if (need > EXT_MAX) {                             // past the end stop: heavy rubbery resistance
      const over = need - EXT_MAX;
      const allowed = reach + EXT_MAX + over * .14 / (1 + over / 160);
      tx = bx + dx / d * allowed; ty = by + dy / d * allowed;
      need = EXT_MAX;
    }
    const targetExt = Math.max(0, need);
    const prevExt = ext;
    ext += (targetExt - ext) * .55;
    extV = (ext - prevExt) * 60;
    target = { x: Math.max(14, Math.min(W - 14, tx)), y: Math.min(H - 46, ty) };
  }

  /* ----- input ----- */
  const local = (e: PointerEvent): P => { const r = wrap.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  function startDrag(e_: PointerEvent, i_: number) { wake(); return startDrag_(e_, i_); }
  let dragOffs: (() => void)[] = [];
  function startDrag_(e: PointerEvent, idx: number) {
    grab = idx;
    const p = local(e), g = pts[idx];
    grabOff = { x: p.x - g.x, y: p.y - g.y };
    ptr = ptrPrev = p; target = { x: g.x, y: g.y };
    downAt = performance.now(); downPos = p; moved = 0;
    wrap.classList.add('dragging');
    dragOffs.forEach((off) => off());
    dragOffs = [
      S.on(window, 'pointermove', onMove, { passive: false }),
      S.on(window, 'pointerup', endDrag),
      S.on(window, 'pointercancel', endDrag),
    ];
  }
  function onMove(e: PointerEvent) {
    if (grab < 0) return;
    e.preventDefault();
    ptrPrev = ptr; ptr = local(e);
    moved = Math.max(moved, Math.hypot(ptr.x - downPos.x, ptr.y - downPos.y));
  }
  function endDrag() {
    if (grab < 0) return;
    const g = pts[grab];
    // fling: carry the hand's last velocity into the rope
    if (ptr && ptrPrev) {
      const vx = (ptr.x - ptrPrev.x), vy = (ptr.y - ptrPrev.y);
      g.px = g.x - vx * .5; g.py = g.y - vy * .5;
    }
    const tap = moved < 6 && performance.now() - downAt < 300;
    grab = -1; target = null; ptr = ptrPrev = null;
    wrap.classList.remove('dragging');
    dragOffs.forEach((off) => off()); dragOffs = [];
    if (tap) tug();
  }
  // a quick tug (tap, click or keyboard) yanks the cord just past the click point
  function tug() { wake(); extV = EXT_MAX * 44; pts[N].px = pts[N].x + 1.5; }

  hit.addEventListener('pointerdown', (e) => {
    if (!dropped) return;
    e.preventDefault();
    try { hit.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
    startDrag(e, N);
  });
  hit.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tug(); } });
  hit.addEventListener('click', (e) => e.preventDefault());

  // desktop: the rope itself can be grabbed anywhere along its length
  S.on(document, 'pointerdown', (e) => {
    if (!dropped || e.pointerType !== 'mouse' || e.button !== 0 || grab >= 0 || e.target === hit) return;
    const p = local(e);
    if (p.x < 0 || p.y < 0 || p.x > W || p.y > H) return;
    let best = -1, bd = 11;
    for (let i = 2; i <= N; i++) {
      if (pts[i].y < 0) continue;
      const d = Math.hypot(pts[i].x - p.x, pts[i].y - p.y);
      if (d < bd) { bd = d; best = i; }
    }
    if (best > 0) { e.preventDefault(); startDrag(e, best); }
  });
  // brushing past the rope with the mouse nudges it
  const brush: { last: P | null } = { last: null };
  S.on(window, 'pointermove', (e) => {
    if (grab >= 0 || e.pointerType !== 'mouse') return;
    const p = local(e);
    if (p.x < -20 || p.y < -20 || p.x > W + 20 || p.y > H + 20) { brush.last = null; return; }
    if (brush.last) {
      wake();
      const vx = p.x - brush.last.x, vy = p.y - brush.last.y;
      for (let i = 2; i <= N; i++) {
        const q = pts[i], d = Math.hypot(q.x - p.x, q.y - p.y);
        if (d < 16) { const f = (1 - d / 16) * .35; q.x += vx * f; q.y += vy * f * .5; }
      }
    }
    brush.last = p;
  }, { passive: true });

  /* ----- drawing ----- */
  function pathThrough(c: CanvasRenderingContext2D, ps: P[]) {
    c.beginPath();
    c.moveTo(ps[0].x, ps[0].y);
    for (let i = 1; i < ps.length - 1; i++) {
      const mx = (ps[i].x + ps[i + 1].x) / 2, my = (ps[i].y + ps[i + 1].y) / 2;
      c.quadraticCurveTo(ps[i].x, ps[i].y, mx, my);
    }
    const l = ps[ps.length - 1]; c.lineTo(l.x, l.y);
  }
  // sample the smoothed rope densely for the braid texture
  function samples(ps: P[], spacing: number): Sample[] {
    const out: Sample[] = [];
    let carry = 0;
    for (let i = 0; i < ps.length - 1; i++) {
      const a = ps[i], b = ps[i + 1];
      const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1e-6;
      let s = carry;
      while (s < len) { out.push({ x: a.x + dx * s / len, y: a.y + dy * s / len, tx: dx / len, ty: dy / len }); s += spacing; }
      carry = s - len;
    }
    return out;
  }
  function knobPath(c: CanvasRenderingContext2D) {
    c.beginPath();
    c.moveTo(-3.1, 6.2);
    c.bezierCurveTo(-3.6, 10.5, -9.6, 13.5, -9.6, 22.5);
    c.bezierCurveTo(-9.6, 30.5, -5.4, 35, 0, 35);
    c.bezierCurveTo(5.4, 35, 9.6, 30.5, 9.6, 22.5);
    c.bezierCurveTo(9.6, 13.5, 3.6, 10.5, 3.1, 6.2);
    c.closePath();
  }
  function drawKnob(c: CanvasRenderingContext2D, x: number, y: number, ang: number, shadowOnly: boolean) {
    c.save();
    c.translate(x, y); c.rotate(ang - Math.PI / 2); c.scale(knobS, knobS);
    if (shadowOnly) {
      knobPath(c); c.fill();
      c.fillRect(-3.4, -.5, 6.8, 7.5);
      c.restore(); return;
    }
    // brass ferrule where the cord is crimped
    const fg = c.createLinearGradient(-3.6, 0, 3.6, 0);
    fg.addColorStop(0, '#5b4a2c'); fg.addColorStop(.3, '#e8d59e'); fg.addColorStop(.55, '#b0924f'); fg.addColorStop(1, '#4a3a1f');
    c.fillStyle = fg;
    c.beginPath();
    if (c.roundRect) c.roundRect(-3.5, -.6, 7, 7.6, 1.2); else (c as CanvasRenderingContext2D).rect(-3.5, -.6, 7, 7.6);
    c.fill();
    c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(-3.5, 2.6, 7, .7); c.fillRect(-3.5, 4.4, 7, .6);
    // turned walnut body
    knobPath(c);
    const bg = c.createLinearGradient(-9.6, 0, 9.6, 0);
    bg.addColorStop(0, '#24150c'); bg.addColorStop(.22, '#6b3f22'); bg.addColorStop(.4, '#a8693d');
    bg.addColorStop(.58, '#7c4828'); bg.addColorStop(.85, '#3b2213'); bg.addColorStop(1, '#1d110a');
    c.fillStyle = bg; c.fill();
    c.save(); knobPath(c); c.clip();
    // grain
    c.strokeStyle = 'rgba(30,14,6,.28)'; c.lineWidth = .55;
    for (let k = -3; k <= 3; k++) {
      c.beginPath(); c.moveTo(k * 2.4 - .6, 8); c.bezierCurveTo(k * 2.9 + 1, 16, k * 2.2 - 1, 26, k * 1.6, 35); c.stroke();
    }
    // soft top-left key light + bottom occlusion
    const hl = c.createRadialGradient(-3.6, 17, .5, -3.6, 17, 9);
    hl.addColorStop(0, 'rgba(255,226,190,.42)'); hl.addColorStop(1, 'rgba(255,226,190,0)');
    c.fillStyle = hl; c.fillRect(-10, 6, 20, 30);
    const bo = c.createLinearGradient(0, 24, 0, 35.5);
    bo.addColorStop(0, 'rgba(0,0,0,0)'); bo.addColorStop(1, 'rgba(0,0,0,.35)');
    c.fillStyle = bo; c.fillRect(-10, 6, 20, 30);
    c.restore();
    // crisp specular streak
    c.fillStyle = 'rgba(255,240,220,.38)';
    c.beginPath(); c.ellipse(-4.4, 20.5, 1.1, 5.2, -.08, 0, Math.PI * 2); c.fill();
    c.restore();
  }
  function draw() {
    const c = ctx;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, W, H);
    const ps = pts;
    const last = ps[N], prev = ps[N - 1];
    const ang = Math.atan2(last.y - prev.y, last.x - prev.x);

    // cast shadow on the wall behind
    const sa = parseFloat(getComputedStyle(root).getPropertyValue('--cord-shadow')) || .2;
    c.save();
    c.translate(7, 11);
    if ('filter' in c) c.filter = 'blur(3px)';
    c.strokeStyle = `rgba(0,0,0,${sa * .8})`; c.lineWidth = thick + 1; c.lineCap = 'round';
    pathThrough(c, ps); c.stroke();
    c.fillStyle = `rgba(0,0,0,${sa})`;
    drawKnob(c, last.x, last.y, ang, true);
    c.restore();

    // braided cotton cord: dark edge, body, light side, twist
    c.lineCap = 'round'; c.lineJoin = 'round';
    pathThrough(c, ps);
    c.strokeStyle = '#6f6455'; c.lineWidth = thick + 1.3; c.stroke();
    c.strokeStyle = '#d6ccba'; c.lineWidth = thick; c.stroke();
    const sm = samples(ps, thick * 1.05);
    c.lineWidth = Math.max(.6, thick * .24);
    c.strokeStyle = 'rgba(96,82,64,.55)';
    c.beginPath();
    for (const q of sm) {
      if (q.y < -2) continue;
      const nx = -q.ty, ny = q.tx, h = thick * .5;
      c.moveTo(q.x - nx * h - q.tx * h * .7, q.y - ny * h - q.ty * h * .7);
      c.lineTo(q.x + nx * h + q.tx * h * .7, q.y + ny * h + q.ty * h * .7);
    }
    c.stroke();
    // highlight along the lit side
    c.save();
    c.translate(-thick * .2, -thick * .05);
    pathThrough(c, ps);
    c.strokeStyle = 'rgba(255,252,244,.55)'; c.lineWidth = thick * .28; c.stroke();
    c.restore();

    drawKnob(c, last.x, last.y, ang, false);

    // keep the hit target on the knob
    const kx = last.x + Math.cos(ang) * 20 * knobS, ky = last.y + Math.sin(ang) * 20 * knobS;
    hit.style.transform = `translate(${kx}px, ${ky}px)`;
  }

  // the rope sleeps once it hangs still, so it costs nothing while you scroll; touching, pulling or resizing wakes it
  let sleeping = false, still = 0;
  let touchedAt = 0;
  function wake() { still = 0; touchedAt = performance.now(); if (!sleeping) return; sleeping = false; lastT = 0; acc = 0; S.raf(loop); }
  hooks.cordWake = wake;
  function loop(now: number) {
    if (!lastT) lastT = now;
    const dt = Math.min((now - lastT) / 1000, 1 / 20); lastT = now;
    updateDrag();
    acc += dt;
    while (acc >= STEP) { step(STEP); acc -= STEP; }
    // left alone, the swing calms a little faster so the rope comes to rest (and stops costing anything) sooner
    if (dropped && live && grab < 0 && now - touchedAt > 2500) for (const q of pts) { q.px += (q.x - q.px) * .06; q.py += (q.y - q.py) * .06; }
    draw();
    let motion = Math.abs(extV) + Math.abs(ext);
    for (const q of pts) motion = Math.max(motion, Math.abs(q.x - q.px) + Math.abs(q.y - q.py));
    if (dropped && live && grab < 0 && motion < .06) { if (++still > 30) { for (const q of pts) { q.px = q.x; q.py = q.y; } sleeping = true; return; } } else still = 0;
    S.raf(loop);
  }

  layout();
  // start pulled up out of view; it drops in once the intro has finished
  // folded up above the switch, out of view: it drops and swings into place after the intro
  pts.forEach((p, i) => { p.y = p.py = -HIDDEN - i * seg * .98; p.x = p.px = ax + Math.sin(i * .5) * 1.5; });
  const drop = () => {
    dropped = true;
    for (const p of pts) { p.px = p.x - .45; }       // a slight sideways swing as it falls
    S.timeout(() => { live = true; }, 900);
  };
  if (document.body.classList.contains('ready')) drop();
  else S.on(window, 'intro:ready', () => S.timeout(drop, 650), { once: true });
  let layoutT = 0;
  S.on(window, 'resize', () => { wake(); clearTimeout(layoutT); layoutT = S.timeout(() => { layout(); wake(); }, 100); });
  S.observe(new MutationObserver(wake)).observe(root, { attributes: true, attributeFilter: ['data-mode'] });
  S.raf(loop);
}
