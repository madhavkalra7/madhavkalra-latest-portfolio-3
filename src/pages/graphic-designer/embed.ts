import type { Scope } from '../../lib/scope';
import { $$, must, selfOrigin } from '../../lib/dom';

/** Inside the home page's frame: the way back closes the room, and the home page steers it (enter / exit / reset / mode). */
export function embedBridge(S: Scope): void {
  const root = document.documentElement, EMBED = root.classList.contains('embed');
  if (!EMBED) return;
  const back = $$<HTMLAnchorElement>('a[href="/#works"]');
  back.forEach((b) => S.on(b, 'click', (e) => { e.preventDefault(); parent.postMessage({ wall: 'close' }, selfOrigin()); }));
  S.on(window, 'keydown', (e) => { if (e.key === 'Escape') parent.postMessage({ wall: 'close' }, selfOrigin()); });
  S.on(window, 'message', (e) => {
    if (e.source !== parent) return;                      // only the home page holding this room may steer it
    const m = (e.data || {}) as { wall?: string; mode?: string };
    if (m.wall === 'enter') { root.classList.remove('out'); scrollTo(0, 0); S.raf(() => root.classList.add('in')); }
    if (m.wall === 'exit') { root.classList.add('out'); root.classList.remove('in'); const lb = must('#lb'); lb.classList.remove('open'); lb.hidden = true; }
    if (m.wall === 'reset') { root.classList.remove('out', 'in'); }
    if (m.wall === 'mode') { if (m.mode === 'dark') root.dataset.mode = 'dark'; else delete root.dataset.mode; }
  });
  S.add(() => root.classList.remove('out', 'in'));
}
