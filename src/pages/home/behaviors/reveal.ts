import type { Scope } from '../../../lib/scope';
import { $, must } from '../../../lib/dom';
import { detach, reduced } from './state';

const COLOUR_SRC = '/home/colour.webp';   // revealed under the cursor

/* ---------- LiquidReveal: paint the colour cut-out along the cursor trail ----------
   The trail is kept as a soft mask; each frame the canvas shows  bw·(1−mask) + colour·mask
   (added with 'lighter'), so semi-transparent hair edges keep exactly the same opacity
   instead of doubling up where the colour layer sits on the B&W one. */
function liquidReveal(S: Scope, stage: HTMLElement, canvas: HTMLCanvasElement, afterSrc: string, { brushRadius = 143, decay = 0.016 } = {}) {
  if (reduced) { detach(canvas); return; }
  const base = must<HTMLImageElement>('img', stage);
  const ctx = canvas.getContext('2d')!;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const mk = (): [HTMLCanvasElement, CanvasRenderingContext2D] => { const c = document.createElement('canvas'); return [c, c.getContext('2d')!]; };
  const [bwC, bwX] = mk(), [colC, colX] = mk(), [mask, mX] = mk(), [tmp, tX] = mk();
  const bwImg = new Image(), colImg = new Image();
  bwImg.src = base.currentSrc || base.src; colImg.src = afterSrc;
  let W = 1, H = 1, radius = brushRadius * dpr;
  const points: { x: number; y: number }[] = []; let last: { x: number; y: number } | null = null, idle = 999, running = false, showing = false;

  function fitDraw(x: CanvasRenderingContext2D, img: HTMLImageElement) {
    x.clearRect(0, 0, W, H);
    if (!img.naturalWidth) return;
    // object-fit: contain + object-position: 50% 100%  (matches the base <img>)
    const s = Math.min(W / img.naturalWidth, H / img.naturalHeight);
    const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
    x.drawImage(img, (W - dw) / 2, H - dh, dw, dh);
  }
  function measure() {
    const r = stage.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width * dpr)); H = Math.max(1, Math.round(r.height * dpr));
    for (const c of [canvas, bwC, colC, mask, tmp]) { c.width = W; c.height = H; }
    radius = brushRadius * dpr;
    fitDraw(bwX, bwImg); fitDraw(colX, colImg);
    hide();
  }
  bwImg.onload = () => fitDraw(bwX, bwImg);
  colImg.onload = () => fitDraw(colX, colImg);

  function stamp(x: number, y: number) {
    const g = mX.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.55, 'rgba(255,255,255,.82)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    mX.globalCompositeOperation = 'source-over';
    mX.fillStyle = g; mX.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }
  function render() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(bwC, 0, 0);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.drawImage(mask, 0, 0);                       // bw · (1 − mask)
    tX.globalCompositeOperation = 'source-over';
    tX.clearRect(0, 0, W, H);
    tX.drawImage(colC, 0, 0);
    tX.globalCompositeOperation = 'destination-in';
    tX.drawImage(mask, 0, 0);                        // colour · mask
    ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(tmp, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
  }
  function show() { if (!showing) { showing = true; render(); base.style.visibility = 'hidden'; } }
  function hide() {
    showing = false; base.style.visibility = '';
    ctx.clearRect(0, 0, W, H); mX.clearRect(0, 0, W, H);
  }
  function frame() {
    const drawing = points.length > 0;
    if (drawing) idle = 0; else idle++;
    if (idle >= 120) { hide(); running = false; return; }
    const fade = drawing ? decay : Math.min(decay + idle * 0.004, 0.5);
    mX.globalCompositeOperation = 'destination-out';
    mX.fillStyle = `rgba(0,0,0,${fade})`;
    mX.fillRect(0, 0, W, H);
    if (drawing) { for (const p of points) stamp(p.x, p.y); points.length = 0; }
    render(); show();
    S.raf(frame);
  }
  S.on(window, 'pointermove', (e) => {
    if (!colImg.naturalWidth || !bwImg.naturalWidth) return;
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) * dpr, y = (e.clientY - r.top) * dpr;
    if (x < -radius || y < -radius || x > W + radius || y > H + radius) { last = null; return; }
    if (last) {
      const dx = x - last.x, dy = y - last.y, dist = Math.hypot(dx, dy);
      const step = Math.max(radius * 0.3, 1), n = Math.min(Math.ceil(dist / step), 60);
      for (let i = 1; i <= n; i++) points.push({ x: last.x + dx * i / n, y: last.y + dy * i / n });
    } else points.push({ x, y });
    last = { x, y };
    if (!running) { running = true; idle = 0; S.raf(frame); }
  }, { passive: true });
  S.observe(new ResizeObserver(measure)).observe(stage);
  measure();
}

export function reveal(S: Scope): void {
  if (matchMedia('(max-width: 1023.98px), (hover: none)').matches) {
    detach($<HTMLCanvasElement>('#figCanvas'));                                     // touch screens: the black & white photo, no reveal
  } else liquidReveal(S, must('#fig'), must<HTMLCanvasElement>('#figCanvas'), COLOUR_SRC);
}
