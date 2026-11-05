import type { Scope } from '../../../lib/scope';
import { $ } from '../../../lib/dom';
import { hooks, reduced, root } from './state';

/* ---------- Mode (light / dark) ---------- */
const MODE_KEY = 'madhav-mode';
type Mode = 'light' | 'dark';

export function mode(_S: Scope): void {
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  function getMode(): Mode { return root.dataset.mode === 'dark' ? 'dark' : 'light'; }
  function setMode(m: Mode, animate = true): void {
    if (animate && !reduced && document.startViewTransition) {
      document.startViewTransition(() => setMode(m, false));
      return;
    }
    if (m === 'dark') root.dataset.mode = 'dark'; else delete root.dataset.mode;
    themeMeta?.setAttribute('content', m === 'dark' ? '#1A1818' : '#EEEAE6');
    $('#cordHit')?.setAttribute('aria-checked', String(m === 'dark'));
    try { localStorage.setItem(MODE_KEY, m); } catch { /* storage blocked */ }
  }
  setMode(getMode(), false);
  // the mode is the visitor's choice and is kept for every page, so it is deliberately not undone on unmount
  hooks.toggleMode = () => setMode(getMode() === 'dark' ? 'light' : 'dark');
}
