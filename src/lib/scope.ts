/**
 * Scope: lifecycle bookkeeping for the imperative page behaviours.
 *
 * The original site wires everything up with global listeners, timers, animation frames and observers.
 * Inside React those must be torn down when a page unmounts (and survive StrictMode's mount → unmount →
 * mount in development). Every behaviour receives a Scope and registers through it, so `dispose()`
 * removes all of it in one go and any callback that fires late becomes a no-op.
 */
type Cleanup = () => void;

export class Scope {
  private cleanups: Cleanup[] = [];
  private timeouts = new Set<number>();
  private intervals = new Set<number>();
  private frames = new Set<number>();
  /** true once the owning page has unmounted */
  dead = false;

  /** addEventListener that is removed on dispose */
  on<K extends keyof WindowEventMap>(target: Window, type: K, fn: (e: WindowEventMap[K]) => void, opts?: boolean | AddEventListenerOptions): Cleanup;
  on<K extends keyof DocumentEventMap>(target: Document, type: K, fn: (e: DocumentEventMap[K]) => void, opts?: boolean | AddEventListenerOptions): Cleanup;
  on<K extends keyof HTMLElementEventMap>(target: HTMLElement, type: K, fn: (e: HTMLElementEventMap[K]) => void, opts?: boolean | AddEventListenerOptions): Cleanup;
  on<K extends keyof MediaQueryListEventMap>(target: MediaQueryList, type: K, fn: (e: MediaQueryListEventMap[K]) => void, opts?: boolean | AddEventListenerOptions): Cleanup;
  on(target: EventTarget, type: string, fn: (e: any) => void, opts?: boolean | AddEventListenerOptions): Cleanup;
  on(target: EventTarget, type: string, fn: (e: any) => void, opts?: boolean | AddEventListenerOptions): Cleanup {
    const guarded = (e: Event) => { if (!this.dead) fn(e); };
    target.addEventListener(type, guarded, opts);
    const off = () => target.removeEventListener(type, guarded, opts);
    this.cleanups.push(off);
    return off;
  }

  timeout(fn: () => void, ms = 0): number {
    const id = window.setTimeout(() => { this.timeouts.delete(id); if (!this.dead) fn(); }, ms);
    this.timeouts.add(id);
    return id;
  }

  interval(fn: () => void, ms: number): number {
    const id = window.setInterval(() => { if (!this.dead) fn(); }, ms);
    this.intervals.add(id);
    return id;
  }

  raf(fn: FrameRequestCallback): number {
    const id = requestAnimationFrame((t) => { this.frames.delete(id); if (!this.dead) fn(t); });
    this.frames.add(id);
    return id;
  }

  /** register any observer (Mutation/Intersection/Resize/Performance) so it is disconnected on dispose */
  observe<T extends { disconnect(): void }>(o: T): T {
    this.cleanups.push(() => o.disconnect());
    return o;
  }

  /** arbitrary teardown */
  add(fn: Cleanup): void { this.cleanups.push(fn); }

  dispose(): void {
    if (this.dead) return;
    this.dead = true;
    this.timeouts.forEach((id) => clearTimeout(id));
    this.intervals.forEach((id) => clearInterval(id));
    this.frames.forEach((id) => cancelAnimationFrame(id));
    for (const c of this.cleanups.splice(0).reverse()) {
      try { c(); } catch { /* teardown must never throw */ }
    }
  }
}

export type Behavior = (scope: Scope) => void | Promise<void>;
