import type { Scope } from '../../../lib/scope';
import { $, must } from '../../../lib/dom';
import { reduced } from './state';

/* ---------- Flip calendar: skills on an endless desk-calendar flip ---------- */
export function flipCalendar(S: Scope): void {
  const SKILLS = ['Gen AI Developer', 'Web Developer', 'App Developer', 'Backend Developer', 'RAG Engineer'];
  const HOLD = 1700, FLIP = 1250;
  const cal = $('#cal'); if (!cal) return;
  const body = must('.cal__body', cal), leaf = must('.cal__leaf', cal);
  const under = must('[data-under]', cal), face = must('.cal__face', cal);
  const measure = must('.cal__measure', cal), rings = must('.cal__rings', cal);
  const n = SKILLS.length;
  let i = 0, started = false;

  const paint = (page: HTMLElement, k: number) => {
    must('.cal__word', page).textContent = SKILLS[k];
    must('.cal__no', page).textContent = `${String(k + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
  };
  paint(face, 0); paint(under, 1);

  // size the page to the longest skill, shrink the whole calendar if the column is too narrow
  function fit() {
    cal!.style.fontSize = '';
    const fs = parseFloat(getComputedStyle(cal!).fontSize);
    let max = 0;
    for (const w of SKILLS) { measure.textContent = w; max = Math.max(max, measure.getBoundingClientRect().width); }
    const wEm = max / fs + 0.8 + 0.06;               // word + side padding
    body.style.setProperty('--cal-w', wEm.toFixed(3) + 'em');
    cal!.style.setProperty('--cal-w', wEm.toFixed(3) + 'em');
    const avail = cal!.closest('.h1')!.getBoundingClientRect().width - fs * 0.25;
    const need = wEm * fs;
    if (need > avail) cal!.style.fontSize = (fs * avail / need).toFixed(2) + 'px';
    // spiral rings + punched holes, spaced roughly every 0.62em
    const count = Math.max(5, Math.round((wEm - 0.64) / 0.7) + 1);
    rings.innerHTML = '<i></i>'.repeat(count);
    cal!.querySelectorAll('.cal__holes').forEach((h) => (h.innerHTML = '<i></i>'.repeat(count)));
  }
  fit();
  document.fonts?.ready.then(() => { if (!S.dead) fit(); });
  let fitT = 0;
  S.on(window, 'resize', () => { clearTimeout(fitT); fitT = S.timeout(fit, 120); });

  function flip() {
    if (document.hidden) { S.timeout(flip, 600); return; }
    const next = (i + 1) % n;
    if (reduced) {
      i = next; paint(face, i); paint(under, (i + 1) % n);
      S.timeout(flip, HOLD + 700); return;
    }
    const timing: KeyframeAnimationOptions = { duration: FLIP, easing: 'cubic-bezier(.5,.05,.2,1)', fill: 'forwards' };
    face.animate([{ opacity: 1 }, { opacity: 1, offset: .285 }, { opacity: 0, offset: .295 }, { opacity: 0 }], { duration: FLIP, easing: 'linear', fill: 'forwards' });
    // once the page is over the top it slips away behind the calendar instead of hanging over the text
    // the back of the page catches the light as it comes over the top, then falls into shadow as it drops behind the stack
    must('.cal__rear', leaf).animate([{ filter: 'brightness(1)' }, { filter: 'brightness(1.02)', offset: .29 }, { filter: 'brightness(.96)', offset: .45 }, { filter: 'brightness(.9)' }], { duration: FLIP, easing: 'linear', fill: 'forwards' });
    const a = leaf.animate([
      { transform: 'translateZ(.004em) rotateX(0deg)' },
      { transform: 'translateZ(.004em) rotateX(352deg)' },
    ], timing);
    must('.cal__shade', face).animate([{ opacity: 0 }, { opacity: .45, offset: .2 }, { opacity: 0, offset: .275 }, { opacity: 0 }], { duration: FLIP, easing: 'linear', fill: 'forwards' });
    must('.cal__shade', under).animate([{ opacity: .7 }, { opacity: 0 }], { duration: FLIP * .9, easing: 'cubic-bezier(.3,.6,.4,1)', fill: 'forwards' });
    a.onfinish = () => {
      if (S.dead) return;
      i = next;
      paint(face, i);                       // the leaf now shows what was underneath…
      leaf.getAnimations({ subtree: true }).forEach((x) => x.cancel());
      cal!.querySelectorAll('.cal__shade').forEach((sh) => sh.getAnimations().forEach((x) => x.cancel()));
      paint(under, (i + 1) % n);            // …and the next skill waits below
      S.timeout(flip, HOLD);
    };
  }
  const start = () => { if (started) return; started = true; S.timeout(flip, 1300); };
  if (document.body.classList.contains('ready')) start(); else S.on(window, 'intro:ready', start, { once: true });
}
