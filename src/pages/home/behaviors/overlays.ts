import type { Scope } from '../../../lib/scope';
import { $, $$, must } from '../../../lib/dom';
import { NAV } from '../data';
import { FOCUSABLE, bindHovers, hooks, scrollToId, startScroll, stopScroll } from './state';

/* ---------- overlays ---------- */
// the keydown handler of each open layer (was `el._key`)
const keyOff = new WeakMap<HTMLElement, () => void>();
function openLayer(S: Scope, el: HTMLElement, onKey: () => void) {
  el.hidden = false; stopScroll();
  S.raf(() => S.raf(() => el.classList.add('open')));
  const key = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { onKey(); return; }
    // keep Tab inside the open layer: without this the keyboard walks onto the page behind it
    if (e.key !== 'Tab') return;
    const f = $$(FOCUSABLE, el).filter((n) => n.offsetWidth || n.offsetHeight || n.getClientRects().length);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (!el.contains(document.activeElement)) { e.preventDefault(); first.focus(); return; }
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  keyOff.get(el)?.();
  keyOff.set(el, S.on(window, 'keydown', key));
}
function closeLayer(S: Scope, el: HTMLElement, after?: () => void) {
  if (el.hidden) return;
  el.classList.remove('open'); el.classList.add('closing');
  keyOff.get(el)?.(); keyOff.delete(el);
  S.timeout(() => { el.hidden = true; el.classList.remove('closing'); startScroll(); after?.(); }, 460);
}

/** Nav menu, the request modal and its form, and the in-page routing of [data-contact] / [data-door] / [data-go]. */
export function overlays(S: Scope): void {
  // nav menu (its items are rendered from NAV in HomePage.tsx)
  const navm = must('#navm');
  const openNav = () => { openLayer(S, navm, closeNav); S.timeout(() => must('#navClose').focus(), 60); };
  const closeNav = (after?: unknown) => closeLayer(S, navm, typeof after === 'function' ? (after as () => void) : () => must('#menuBtn').focus());
  S.on(must('#menuBtn'), 'click', openNav);
  S.on(must('#navClose'), 'click', closeNav);
  S.on(must('#navList'), 'click', (e) => {
    const b = (e.target as Element).closest<HTMLElement>('.navm__item'); if (!b) return;
    const id = NAV[+b.dataset.i!][1];
    closeNav(() => typeof id === 'number' ? hooks.openDoor?.(id) : id ? scrollToId(S, id) : openModal());
  });
  S.on(must('#navStart'), 'click', () => closeNav(() => openModal()));
  // request modal
  const CONTACT_EMAIL = ['madhavkalra2005', 'gmail.com'].join('@');   // where project requests go (assembled here so address-harvesting bots don't find it in the page)
  $$<HTMLAnchorElement>('[data-mail]').forEach((a) => { a.href = 'mailto:' + CONTACT_EMAIL; a.textContent = CONTACT_EMAIL; });
  const modal = must('#modal'), form = must<HTMLFormElement>('#reqForm');
  let lastFocus: HTMLElement | null = null;
  function openModal() { lastFocus = document.activeElement as HTMLElement | null; openLayer(S, modal, closeModal); S.timeout(() => $('#f-name')?.focus({ preventScroll: true }), 120); }
  hooks.openModal = openModal;
  let lastInput = 'mouse';
  S.on(window, 'pointerdown', () => { lastInput = 'mouse'; }, true);
  S.on(window, 'keydown', (e) => { if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ') lastInput = 'key'; }, true);
  function closeModal() {
    closeLayer(S, modal, () => {
      // give focus back only to keyboard users, so a mouse click doesn't leave the nav item looking hovered
      if (lastInput === 'key') lastFocus?.focus?.({ preventScroll: true }); else (document.activeElement as HTMLElement | null)?.blur?.();
      S.timeout(() => { form.reset(); must('#mForm').hidden = false; must('#mSuccess').hidden = true; must('#mSendLbl').textContent = SEND_LABEL; }, 300);
    });
  }
  S.on(modal, 'click', closeModal);
  S.on(must('#mPanel'), 'click', (e) => e.stopPropagation());
  S.on(must('#mClose'), 'click', closeModal);
  S.on(must('#mDone'), 'click', closeModal);
  // the form sends for real only on the live website (Netlify receives it); anywhere else it opens an email
  const FORM_LIVE = /(^|\.)madhavkalra\.dev$|\.netlify\.app$/.test(location.hostname);
  const SEND_LABEL = FORM_LIVE ? 'Send message' : 'Write the email';
  must('#mSendLbl').textContent = SEND_LABEL;
  S.on(form, 'submit', (e) => {
    e.preventDefault();
    const d = new FormData(form), val = (k: string) => String(d.get(k) || '').trim();
    const name = val('name'), mail = val('email'), phone = val('phone'), proj = val('project');
    const subject = `Service enquiry from ${name}`;
    const body = `Hi Madhav,\n\n${proj}\n\n— ${name}\n${mail}\n${phone}`;
    const viaMail = () => {
      if (S.dead) return;
      location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      must('#mOkT').textContent = 'Almost there';
      must('#mOkP').textContent = "Your email app has opened with your message ready to go. Press send there and I'll reply within one business day.";
      must('.msuccess__alt').hidden = false;
      must('#mForm').hidden = true; must('#mSuccess').hidden = false; must('#mDone').focus();
    };
    if (!FORM_LIVE) { viaMail(); return; }
    // on the real site the message goes straight to my inbox through Netlify Forms; if that fails for any reason, fall back to email
    const btn = must<HTMLButtonElement>('#mSend'); btn.disabled = true; must('#mSendLbl').textContent = 'Sending…';
    // the form has only text fields, so every entry is a string
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(d as unknown as Record<string, string>).toString() })
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        if (S.dead) return;
        must('#mOkT').textContent = 'Message sent';
        must('#mOkP').textContent = `Thanks, ${name}. I'll reply to ${mail} within one business day.`;
        must('.msuccess__alt').hidden = true;
        must('#mForm').hidden = true; must('#mSuccess').hidden = false; must('#mDone').focus();
      })
      .catch(viaMail)
      .finally(() => { if (S.dead) return; btn.disabled = false; must('#mSendLbl').textContent = SEND_LABEL; });
  });
  // routing for in-page buttons
  S.on(document, 'click', (e) => {
    const t = e.target as Element;
    const ln = t.closest('a[data-door],a[data-go]');
    if (ln) { if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return; e.preventDefault(); }   // a real link for crawlers and new tabs; a plain click stays in the page
    const c = t.closest('[data-contact]'); if (c) { openModal(); return; }
    const dr = t.closest<HTMLElement>('[data-door]'); if (dr) { hooks.openDoor?.(+dr.dataset.door!); return; }
    const g = t.closest<HTMLElement>('[data-go]'); if (g) scrollToId(S, g.dataset.go!);
  });

  bindHovers(S);
}
