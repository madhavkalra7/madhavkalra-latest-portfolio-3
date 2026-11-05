import type { Scope } from '../../lib/scope';
import { $$, selfOrigin } from '../../lib/dom';
import { room } from './stack';

/**
 * Port of 02-body.js (identical in web-developer and ui-ux-designer): when the room is shown inside the home page's
 * iframe, the home page steers it with messages (enter / exit / reset / mode), and leaving asks the home page to close it.
 */
export function embedBridge(S: Scope): void {
  const root = document.documentElement, EMBED = root.classList.contains('embed');
  if (!EMBED) return;
  const back = $$<HTMLAnchorElement>('a[href="/#works"]');
  back.forEach((b) => S.on(b, 'click', (e) => { e.preventDefault(); parent.postMessage({ wall: 'close' }, selfOrigin()); }));
  S.on(window, 'keydown', (e) => { if (e.key === 'Escape') parent.postMessage({ wall: 'close' }, selfOrigin()); });
  S.on(window, 'message', (e) => {
    if (e.source !== parent) return; // only the home page holding this room may steer it
    const m = (e.data || {}) as { wall?: string; mode?: string };
    if (m.wall === 'enter') {
      root.classList.remove('out'); scrollTo(0, 0); room.restartAll(); S.raf(() => root.classList.add('in'));
      clearTimeout(room.liveT); room.liveT = S.timeout(() => { room.live = true; room.checkHidden(); dispatchEvent(new Event('scroll')); }, 650);
    }
    if (m.wall === 'exit') { clearTimeout(room.liveT); room.live = false; root.classList.add('out'); root.classList.remove('in'); $$<HTMLVideoElement>('video').forEach((v) => v.pause()); }
    if (m.wall === 'reset') { root.classList.remove('out', 'in'); }
    if (m.wall === 'mode') { if (m.mode === 'dark') root.dataset.mode = 'dark'; else delete root.dataset.mode; }
  });
  // data-mode is the site-wide theme (also set by the pre-paint script), so it is left as is
  S.add(() => root.classList.remove('out', 'in'));
}
