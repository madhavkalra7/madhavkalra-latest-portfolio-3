import type { Scope } from '../lib/scope';
import { selfOrigin } from '../lib/dom';

type FsDoc = Document & { webkitFullscreenElement?: Element | null; webkitExitFullscreen?: () => Promise<void> };
type FsEl = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> };

/** Press F for full screen (again, or Esc, to leave); ignored while typing. Frames ask their parent page. */
export function fullscreen(S: Scope): void {
  const typing = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    return !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
  };
  const toggle = () => {
    const d = document as FsDoc, el = d.documentElement as FsEl;
    if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen)?.call(d);
    else (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el)?.catch?.(() => {});
  };
  S.on(window, 'keydown', (e) => {
    if ((e.key !== 'f' && e.key !== 'F') || e.metaKey || e.ctrlKey || e.altKey || typing(e)) return;
    e.preventDefault();
    if (window.top !== window) { try { parent.postMessage({ wall: 'fullscreen' }, selfOrigin()); } catch { /* cross-origin parent */ } return; }
    toggle();
  });
  if (window.top === window) S.on(window, 'message', (e) => {
    // only one of this page's own frames can ask for full screen
    if (!e.data || e.data.wall !== 'fullscreen' || ![...document.querySelectorAll('iframe')].some((f) => f.contentWindow === e.source)) return;
    toggle();
  });
}
