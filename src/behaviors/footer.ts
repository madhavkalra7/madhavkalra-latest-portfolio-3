import type { Scope } from '../lib/scope';
import { $, $$ } from '../lib/dom';

/**
 * Site footer + floating back-to-top (shared by the home page and the rooms):
 * live clock and year, the footer name sized to span the full width, the footer's rounded
 * corners painted with the colour of the section above, and the scroll-progress back-to-top button.
 */
export function footer(S: Scope): void {
  const tick = () => {
    const d = new Date(), h = d.getHours();
    $$('[data-ftime]').forEach((e) => (e.textContent = `${h % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')}${h < 12 ? 'am' : 'pm'}`));
    $$('[data-fyear]').forEach((e) => (e.textContent = String(d.getFullYear())));
  };
  tick(); S.interval(tick, 20000);

  // size the footer name so it spans the full width with only a sliver of margin
  const fit = () => $$('.sf').forEach((f) => {
    const w = $('.sf__word', f); if (!w) return;
    const span = ([...w.children] as HTMLElement[]).find((s) => getComputedStyle(s).display !== 'none'); if (!span) return;
    w.style.setProperty('--wf', '100px');
    const k = (f.clientWidth * 0.955) / span.getBoundingClientRect().width;
    f.style.setProperty('--wf', (100 * k).toFixed(2) + 'px'); w.style.removeProperty('--wf');
  });
  fit(); S.on(window, 'resize', fit); document.fonts?.ready.then(() => { if (!S.dead) fit(); });

  // the footer's rounded corners show whatever sits directly above it: find that section's colour and paint it behind them
  const sfw = $('.sfw');
  const above = () => {
    if (!sfw) return;
    const solid = (e: Element) => { const c = getComputedStyle(e).backgroundColor; const m = c.match(/[\d.]+/g); return m && !(m.length > 3 && +m[3] < 0.05) ? c : ''; };
    let col = '', e = sfw.previousElementSibling;
    while (e) { if (e.getBoundingClientRect().width >= innerWidth * 0.9) { const c = solid(e); if (c) col = c; } e = e.lastElementChild; }
    const bg = col || solid(document.body) || getComputedStyle(document.documentElement).backgroundColor;
    sfw.style.setProperty('--above', bg);
    // a dark section above: a hairline keeps the footer reading as its own section
    const m = (bg.match(/[\d.]+/g) || ['255', '255', '255']).map(Number);
    sfw.classList.toggle('sfw--dark', (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255 < 0.25);
  };
  above(); S.on(window, 'load', above); S.on(window, 'resize', above);
  S.observe(new MutationObserver(above)).observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] });

  // floating back-to-top: appears after the first screen, shows scroll progress, flips colour over dark backgrounds
  const tt = $('.totop');
  if (!tt) return;
  tt.style.setProperty('--len', (2 * Math.PI * 24).toFixed(2));
  const lum = (el: Element) => {
    for (let e: Element | null = el; e && e !== document.documentElement; e = e.parentElement) {
      const m = getComputedStyle(e).backgroundColor.match(/[\d.]+/g); if (!m) continue;
      if (m.length > 3 && +m[3] < 0.5) continue;
      return (0.2126 * +m[0] + 0.7152 * +m[1] + 0.0722 * +m[2]) / 255;
    }
    const m = getComputedStyle(document.body).backgroundColor.match(/[\d.]+/g) || ['255', '255', '255'];
    return m.length > 3 && +m[3] < 0.5
      ? (document.documentElement.dataset.mode === 'dark' ? 0 : 1)
      : (0.2126 * +m[0] + 0.7152 * +m[1] + 0.0722 * +m[2]) / 255;
  };
  let raf = 0;
  const upd = () => {
    raf = 0;
    const max = document.documentElement.scrollHeight - innerHeight, y = scrollY;
    const bot = $('.sf__bot'); // the footer has its own 'Back to top', so step aside once it's on screen
    tt.classList.toggle('show', y > innerHeight * 0.9 && !(bot && bot.getBoundingClientRect().top < innerHeight - 8));
    tt.style.setProperty('--p', max > 0 ? Math.min(1, y / max).toFixed(4) : '0');
    const r = tt.getBoundingClientRect();
    tt.style.pointerEvents = 'none';
    const under = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    tt.style.pointerEvents = '';
    if (under) tt.dataset.on = lum(under) < 0.45 ? 'dark' : 'light';
  };
  const q = () => { if (!raf) raf = S.raf(upd); };
  S.on(window, 'scroll', q, { passive: true }); S.on(window, 'resize', q);
  S.observe(new MutationObserver(q)).observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode', 'class'] });
  upd();
}
