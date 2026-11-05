import type { Scope } from '../lib/scope';
import { $ } from '../lib/dom';

declare global {
  interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void }
}

const ID = 'G-12PNLHKGHK', K = 'rishi-analytics';
let loaded = false;

/** Google Analytics, only after the visitor allows it in the cookie banner (#ck). */
export function analytics(S: Scope): void {
  let v: string | null = null;
  try { v = localStorage.getItem(K); } catch { /* storage blocked */ }
  const load = () => {
    if (loaded) return; loaded = true;
    window.dataLayer = window.dataLayer || [];
    // gtag needs the real `arguments` object, not an array
    // eslint-disable-next-line prefer-rest-params
    window.gtag = function () { window.dataLayer!.push(arguments); };
    window.gtag('js', new Date()); window.gtag('config', ID);
    const s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID; document.head.appendChild(s);
  };
  if (v === 'yes') return load();
  if (v === 'no') return;
  const b = $('#ck'); if (!b) return;
  b.hidden = false;
  S.on(b, 'click', (e) => {
    const c = (e.target as Element).closest<HTMLElement>('[data-ck]'); if (!c) return;
    try { localStorage.setItem(K, c.dataset.ck!); } catch { /* storage blocked */ }
    b.hidden = true; if (c.dataset.ck === 'yes') load();
  });
}
