import type { Scope } from '../../../lib/scope';
import { root, st } from './state';

/* ---------- Lenis smooth scroll ----------
   The original imported it (through an import map) at the very end of the module with a top-level await,
   so it is the last thing to start and nothing waits for it. */
export async function smoothScroll(S: Scope): Promise<void> {
  try {
    if (matchMedia('(hover: none), (pointer: coarse)').matches || root.classList.contains('lite')) return;   // phones and modest devices keep native momentum scrolling
    const { default: Lenis } = await import('lenis');
    if (S.dead) return;
    const lenis = new Lenis({ smoothWheel: true }); st.lenis = lenis; window.__lenis = lenis;
    S.add(() => {
      lenis.destroy();
      if (st.lenis === lenis) st.lenis = null;
      if (window.__lenis === lenis) delete window.__lenis;
    });
    if (!st.scrollEnabled) lenis.stop();
    const raf = (t: number) => { lenis.raf(t); S.raf(raf); };
    S.raf(raf);
  } catch { /* native scrolling as fallback */ }
}
