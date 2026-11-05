import { useEffect, useLayoutEffect } from 'react';
import { Scope, type Behavior } from './scope';

/**
 * Inject a page's stylesheet while the page is mounted.
 * Each original page shipped its own complete stylesheet (including :root / html / body rules), so they
 * cannot all be loaded globally at once. Layout effect: the CSS lands before first paint.
 */
export function usePageStyles(...sheets: string[]): void {
  useLayoutEffect(() => {
    const els = sheets.map((css, i) => {
      const el = document.createElement('style');
      el.dataset.page = String(i);
      el.textContent = css;
      document.head.appendChild(el);
      return el;
    });
    return () => els.forEach((el) => el.remove());
    // the sheets are module constants
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Run the page's imperative behaviours, in order, after the markup is in the DOM.
 * Each behaviour gets its own Scope; everything it registered is torn down on unmount.
 */
export function useBehaviors(...behaviors: Behavior[]): void {
  useEffect(() => {
    const scopes: Scope[] = [];
    for (const b of behaviors) {
      const s = new Scope();
      scopes.push(s);
      try {
        const r = b(s);
        if (r instanceof Promise) r.catch((err) => console.error(err));
      } catch (err) {
        // one broken behaviour must not take the rest of the page down (the original scripts were independent)
        console.error(err);
      }
    }
    return () => scopes.forEach((s) => s.dispose());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Set attributes / classes on <html> and <body> for the lifetime of a page. */
export function useDocumentAttrs(opts: { htmlClass?: string; bodyClass?: string; bodyAttrs?: Record<string, string> }): void {
  useLayoutEffect(() => {
    const html = document.documentElement, body = document.body;
    const hc = opts.htmlClass?.split(/\s+/).filter(Boolean) ?? [];
    const bc = opts.bodyClass?.split(/\s+/).filter(Boolean) ?? [];
    hc.forEach((c) => html.classList.add(c));
    bc.forEach((c) => body.classList.add(c));
    const attrs = Object.entries(opts.bodyAttrs ?? {});
    attrs.forEach(([k, v]) => body.setAttribute(k, v));
    return () => {
      hc.forEach((c) => html.classList.remove(c));
      bc.forEach((c) => body.classList.remove(c));
      attrs.forEach(([k]) => body.removeAttribute(k));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
