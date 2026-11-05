import type { Scope } from '../../../lib/scope';
import { $, $$, must } from '../../../lib/dom';

// my story: you scroll the chapters naturally. The dot travels the line in step with the page, the year rolls back as each
// chapter reaches the middle of the screen, and (on larger screens) the clock tunnel behind the year turns with your scroll.
export function story(S: Scope): void {
  const sec = $('.story'); if (!sec) return;
  const line = must('.story__line', sec), list = must('.story__list', sec);
  const chs = $$('.ch', list), N = chs.length;
  const cols = $$('.dg__c', sec), when = must('.story__when', sec), count = must('.story__count', sec);
  const rail = must('.story__rail', sec), cv = must<HTMLCanvasElement>('.story__bg', sec), ctx = cv.getContext('2d')!;
  const root = document.documentElement;
  let shownYear = '', shown = -1;
  const setYear = (y: string) => { if (y === shownYear) return; shownYear = y; String(y).split('').forEach((d, k) => cols[k] && cols[k].style.setProperty('--d', d)); };
  const show = (i: number) => {
    if (i === shown) return; shown = i;
    chs.forEach((c, k) => c.classList.toggle('on', k === i));
    setYear(chs[i].dataset.y!); when.textContent = chs[i].dataset.when!; count.textContent = String(i + 1).padStart(2, '0');
    sec.classList.toggle('is-now', i === 0);
    sec.dataset.ch = String(i);                             // the backdrop light takes this chapter's colour
  };
  // ---- the tunnel ----
  let W = 0, H = 0, dpr = 1, rgb = '26,24,24';
  const size = () => { dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; };
  const readRgb = () => { rgb = (getComputedStyle(root).getPropertyValue('--fg-rgb') || '26,24,24').trim(); };
  S.observe(new MutationObserver(readRgb)).observe(root, { attributes: true, attributeFilter: ['data-mode'] });
  const RINGS = 16, GAP = 340, FOCAL = 520, R = 620, TICKS = 60;
  const dust = Array.from({ length: 70 }, () => ({ a: Math.random() * Math.PI * 2, r: 120 + Math.random() * 760, z: Math.random() * RINGS * GAP, s: .6 + Math.random() * 1.4 }));
  function tunnel(p: number, t: number) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    const cx = W * .5, cy = H * .55, k = Math.min(W, H) / 900;
    const camZ = p * (N - 1) * GAP * 1.6 + t * 18;          // scrolling carries you deeper into the past; it drifts a little on its own too
    const spin = -p * Math.PI * 1.5 - t * .02;               // the dials wind backwards
    const len = RINGS * GAP;
    ctx.lineCap = 'round';
    for (let i = 0; i < RINGS; i++) {
      const z = ((i * GAP - camZ) % len + len) % len + 60;   // distance in front of the camera, recycled
      const s = FOCAL / z * k, fog = Math.min(1, Math.max(0, (z - 260) / 1100)) * Math.max(0, 1 - z / len);   // fades out as it reaches you, so it never sits over the text
      if (fog <= .01) continue;
      const rr = R * s, rot = spin + i * .21;
      // the ring itself
      ctx.strokeStyle = `rgba(${rgb},${(fog * .12).toFixed(3)})`; ctx.lineWidth = Math.max(.5, 1.2 * s);
      ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.stroke();
      // the clock ticks, long ones on the hours: drawn as two batched paths per dial, not one stroke per tick
      const T = W < 768 ? 36 : TICKS, every = T / 12;
      for (const hour of [false, true]) {
        const l = (hour ? 46 : 18) * s;
        ctx.beginPath();
        for (let j = 0; j < T; j++) {
          if ((j % every === 0) !== hour) continue;
          const a = rot + j / T * Math.PI * 2, c = Math.cos(a), d = Math.sin(a);
          ctx.moveTo(cx + c * (rr - l), cy + d * (rr - l)); ctx.lineTo(cx + c * rr, cy + d * rr);
        }
        ctx.strokeStyle = `rgba(${rgb},${(fog * (hour ? .3 : .14)).toFixed(3)})`; ctx.lineWidth = Math.max(.5, (hour ? 3 : 1.4) * s); ctx.stroke();
      }
      // a single hand on each dial
      const ha = rot * 3 + i;
      ctx.strokeStyle = `rgba(${rgb},${(fog * .16).toFixed(3)})`; ctx.lineWidth = Math.max(.5, 2 * s);
      if (rr < Math.min(W, H) * .45) { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(ha) * rr * .55, cy + Math.sin(ha) * rr * .55); ctx.stroke(); }
    }
    // dust drifting past
    for (const q of dust) {
      const z = ((q.z - camZ * 1.1) % len + len) % len + 40, s = FOCAL / z * k, fog = Math.min(1, Math.max(0, (z - 300) / 900)) * Math.max(0, 1 - z / len);
      const a = q.a + spin * .3;
      ctx.fillStyle = `rgba(${rgb},${(fog * .35).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(cx + Math.cos(a) * q.r * s, cy + Math.sin(a) * q.r * s, Math.max(.4, q.s * s * 2.2), 0, Math.PI * 2); ctx.fill();
    }
  }

  // positions along the line, measured once (and again on resize), never during a scroll
  let firstY = 0, lastY = 0, endY = 0;
  const measure = () => {
    const mark = (c: HTMLElement) => line.offsetTop * 0 + list.offsetTop + c.offsetTop + (c.firstElementChild as HTMLElement).offsetTop + 8;
    firstY = mark(chs[0]); lastY = mark(chs[N - 1]);
    const last = chs[N - 1]; endY = list.offsetTop + last.offsetTop + last.offsetHeight - parseFloat(getComputedStyle(last).paddingBottom);
    for (const el of [rail, must('.story__dtrack', sec), must('.story__ttrack', sec)]) { el.style.setProperty('--r0', firstY + 'px'); el.style.setProperty('--rh', (endY - firstY) + 'px'); }
    if (innerWidth >= 768) size();
  };
  let raf = 0, p = 0;
  function update() {
    raf = 0;
    const lr = line.getBoundingClientRect(), mid = innerHeight * .5;
    // the dot sits wherever the middle of the screen falls on the line
    const y = Math.min(lastY, Math.max(firstY, mid - lr.top));
    p = (y - firstY) / Math.max(1, lastY - firstY);
    sec!.style.setProperty('--p', p.toFixed(4)); sec!.style.setProperty('--warm', p.toFixed(3));
    sec!.classList.toggle('at-start', p < .002);                // nothing travelled yet: no tail poking above the line
    let i = 0; for (let k = 0; k < N; k++) if (lr.top + list.offsetTop + chs[k].offsetTop < mid + 40) i = k;
    show(i);
    if (innerWidth >= 768 && !reducedM && !root.classList.contains('lite')) tunnel(p, 0);
  }
  const reducedM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const q = () => { if (!raf) raf = S.raf(update); };
  S.on(window, 'scroll', q, { passive: true });
  S.on(window, 'resize', () => { measure(); q(); });
  S.observe(new MutationObserver(() => { readRgb(); q(); })).observe(root, { attributes: true, attributeFilter: ['data-mode'] });
  readRgb(); measure(); show(0); update();
  document.fonts?.ready.then(() => { if (S.dead) return; measure(); q(); });
  S.on(window, 'load', () => { measure(); q(); });
}
