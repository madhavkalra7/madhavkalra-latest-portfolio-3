/** Small typed DOM helpers used by the ported behaviours. */

/** querySelector that returns the element typed (defaults to HTMLElement); null when absent */
export function $<T extends Element = HTMLElement>(sel: string, root: ParentNode = document): T | null {
  return root.querySelector<T>(sel);
}

/** querySelectorAll as an array */
export function $$<T extends Element = HTMLElement>(sel: string, root: ParentNode = document): T[] {
  return Array.from(root.querySelectorAll<T>(sel));
}

/** querySelector that must exist (the markup is ours, so a miss is a bug) */
export function must<T extends Element = HTMLElement>(sel: string, root: ParentNode = document): T {
  const el = root.querySelector<T>(sel);
  if (!el) throw new Error(`missing element: ${sel}`);
  return el;
}

export const reducedMotion = (): boolean => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** postMessage target origin used throughout the original code */
export const selfOrigin = (): string => (location.origin === 'null' ? '*' : location.origin);
