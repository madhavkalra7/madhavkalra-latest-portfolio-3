import type { Scope } from '../../../lib/scope';
import { $, $$, must, selfOrigin } from '../../../lib/dom';
import { canHover, hooks, reduced, root, scrollToId, snapTo, spring, st, startScroll, type Spring } from './state';

/* ---------- Doors: hover cracks a door open; click swings it open and carries you through it ---------- */
export function doors(S: Scope): void {
  // each door is its own page (/photographer etc.)
  const ROUTES = ['/web-developer/', '/app-developer/', '/ui-ux-designer/', '/graphic-designer/', '/photographer/'];
  const SLUGS = ['web-developer', 'app-developer', 'ui-ux-designer', 'graphic-designer', 'photographer'];
  // a link like …#photographer lands at the doors and walks straight through that one
  const HASH_DOOR = SLUGS.indexOf(decodeURIComponent(location.hash.slice(1)));
  if (HASH_DOOR >= 0) {
    try { history.replaceState(null, '', location.pathname + location.search + '#works'); } catch { /* history blocked */ }
    S.on(window, 'intro:ready', () => { warm(HASH_DOOR); S.timeout(() => hooks.openDoor?.(HASH_DOOR), 650); }, { once: true });
  }
  const sec = $('#works'); if (!sec) return;
  const units = $$('.unit', sec);
  const veil = must('#veil');
  const ANG = 70, ANG_WALK = 70;                       // fully open, swung into the room
  let busy = false;

  const doorsState: { u: HTMLElement; door: HTMLElement; s: Spring; way: HTMLElement }[] = units.map((u) => {
    const door = must('.door', u);
    const s = spring(S, { tension: 120, friction: 14 }, (o) => {
      door.style.transform = `rotateY(${Math.max(0, o) * ANG}deg)`;   // the frame's door stop: never swings outward
      u.style.setProperty('--o', Math.max(0, o).toFixed(4));
    });
    return { u, door, s, way: must('.doorway', u) };
  });

  // reveal the doors once the wall scrolls into view
  if ('IntersectionObserver' in window && !reduced) {
    sec.classList.add('pre');
    const io = S.observe(new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) {
        sec.classList.add('in');
        S.raf(() => sec.classList.remove('pre'));
        io.disconnect();
      }
    }, { threshold: .18 }));
    io.observe(sec);
  }

  // cursor badge: sits exactly on the pointer (no easing, no travel); only its opacity fades
  const badge = must('#doorCursor');
  let over = false;
  const place = (e: PointerEvent) => { badge.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`; };
  const showBadge = (on: boolean) => { over = on; badge.classList.toggle('on', on); };
  if (canHover) {
    S.on(window, 'pointermove', (e) => { if (over) place(e); }, { passive: true });
    units.forEach((u) => {
      const w = must('.doorway', u);
      w.addEventListener('pointerenter', (e) => { place(e); if (!busy) showBadge(true); });
      w.addEventListener('pointerleave', () => showBadge(false));
    });
  }

  // fetch the page behind a door as soon as someone shows interest in it
  const warmed = new Set<number>();
  const warm = (i: number) => {
    if (warmed.has(i)) return; warmed.add(i);
    loadRoom(i);
  };

  /* The photo wall is loaded, fully painted, inside this page while you stand at the doors.
     Opening the door reveals that same live wall, so there is no page swap to glitch. */
  const wallv = must('#wallv');
  // every door has its own room, loaded inside this page, so stepping in and coming back never reloads anything
  const frames: HTMLIFrameElement[] = [], ready: boolean[] = [], TITLES = ['Web Development', 'App Development', 'UI/UX Design', 'Graphic Design', 'Photography'];
  let frame: HTMLIFrameElement | null = null, frameReady = false, cur = 0, inWall = false, pushed = false;
  function loadRoom(i: number) {
    if (frames[i]) return;
    const f = document.createElement('iframe');
    f.src = ROUTES[i] + '?embed';
    f.title = TITLES[i];
    f.tabIndex = -1;
    f.addEventListener('load', () => { ready[i] = true; if (i === cur) frameReady = true; f.contentWindow?.postMessage({ wall: 'mode', mode: root.dataset.mode === 'dark' ? 'dark' : 'light' }, selfOrigin()); }, { once: true });
    frames[i] = f; wallv.appendChild(f);
  }
  // the rooms are appended inside #wallv, which React renders empty; take them out with the page
  S.add(() => frames.forEach((f) => f?.remove()));
  const pick = (i: number) => { cur = i; frame = frames[i]; frameReady = !!ready[i]; frames.forEach((f, k) => f && f.classList.toggle('cur', k === i)); };
  const toWall = (msg: unknown) => { try { frame?.contentWindow?.postMessage(msg, selfOrigin()); } catch { /* frame gone */ } };
  // start fetching the wall once the doors are near, so a click never waits
  if ('IntersectionObserver' in window) {
    const near = S.observe(new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { near.disconnect(); S.timeout(() => { warm(4); S.timeout(() => [0, 1, 2, 3].forEach(warm), 1500); }, 600); } }, { rootMargin: '200px' }));
    near.observe(sec);
  }

  // hovering the doors: promote them to a GPU layer and pre-render them at the zoom the walk-through will use,
  // so clicking has nothing heavy left to do (a paused animation makes the browser raster at its peak scale)
  const lift = () => {
    if (sec.classList.contains('lift')) return;
    sec.classList.add('lift');
  };
  sec.addEventListener('pointerenter', lift);
  doorsState.forEach((d, i) => {
    d.way.addEventListener('focus', lift);
    d.way.addEventListener('pointerenter', () => warm(i));
    d.way.addEventListener('focus', () => warm(i));
    if (canHover) {
      d.way.addEventListener('mouseenter', () => { if (!busy) d.s.set(.1); });
      d.way.addEventListener('mouseleave', () => { if (!busy) d.s.set(0); });
    }
    d.way.addEventListener('click', () => enter(i));
  });

  // from the nav or a link: go down to the doors, face the right one, then open it and walk in
  // what each door holds: shown beside the door on hover (desktop), under the swipe hint on phones
  const INFO: [string, string, string[]][] = [   // [headline, sub-headline, body]
    ['Web Development', 'AI-powered web apps, end to end', ['AI website generation & agents', 'RAG pipelines & LLM APIs', 'React & Next.js front-ends', 'FastAPI, Node.js & Django back-ends', 'Deployed live on Vercel']],
    ['App Development', 'Android games built for play', ['3D precision gameplay', 'Classic strategy, made digital', 'Offline multiplayer on one device', 'Smooth controls & mechanics']],
    ['UI/UX Design', 'Research first, pixels second', ['Brand & business needs analysis', 'User & competitor research', 'Information architecture & flows', 'Wireframes & high-fidelity UI', 'Interactive prototypes & testing']],
    ['Graphic Design', 'Visual content true to the brand', ['Brand, audience & tone analysis', 'Built around brand guidelines', 'Posters & social media creatives', 'Strong type & clear hierarchy', 'Every format each platform needs']],
    ['Photography', 'The eye behind every layout', ['Architecture, concerts & sport', 'Nature & product', 'Light & composition first']],
  ];
  const dinfo = must('#dinfo'), wallEl = must('.doors__wall', sec), MOB = matchMedia('(max-width: 639.98px)');
  units.forEach((u, i) => must('.doorway', u).setAttribute('aria-description', INFO[i][1] + ': ' + INFO[i][2].join(', ')));
  const setInfo = (i: number) => { must('.dinfo__h', dinfo).textContent = INFO[i][0]; must('.dinfo__t', dinfo).textContent = INFO[i][1]; must('.dinfo__p', dinfo).innerHTML = INFO[i][2].map((s) => `<li>${s}</li>`).join(''); };
  if (canHover) {
    // one source of truth: whichever door is under the pointer right now (re-checked on every move and scroll),
    // so the description can never be left behind however fast the cursor travels
    let active = -1, token = 0, px = -1, py = -1;
    const show = (i: number) => {
      const my = ++token;
      units.forEach((u, k) => u.classList.toggle('on', k === i));
      sec.classList.add('focus');
      const visible = units.filter((u) => getComputedStyle(u).visibility !== 'hidden');
      const vi = visible.indexOf(units[i]); if (vi < 0) return;
      const wr = wallEl.getBoundingClientRect(), r = units[i].getBoundingClientRect();
      const toRight = vi < 2 && visible[vi + 2];
      const a = toRight ? visible[vi + 1].getBoundingClientRect() : (visible[vi - 2] || visible[vi - 1]).getBoundingClientRect();
      const b = toRight ? visible[vi + 2].getBoundingClientRect() : visible[vi - 1].getBoundingClientRect();
      const left = Math.min(a.left, b.left), right = Math.max(a.right, b.right);
      const place = () => {
        if (my !== token || active !== i) return;          // something newer happened: do nothing
        setInfo(i);
        const w = Math.min(right - left, 22 * 16);
        dinfo.style.width = w + 'px';
        dinfo.style.left = (left - wr.left + (right - left - w) / 2) + 'px';        // centred in the space of the faded doors
        dinfo.style.top = (r.top - wr.top + r.height * .5 - dinfo.offsetHeight / 2) + 'px';
        dinfo.classList.add('on');
      };
      if (dinfo.classList.contains('on')) { dinfo.classList.remove('on'); S.timeout(place, 130); } else place();
    };
    const hide = () => { token++; sec.classList.remove('focus'); units.forEach((u) => u.classList.remove('on')); dinfo.classList.remove('on'); };
    const set = (i: number) => { if (busy) i = -1; if (i === active) return; active = i; if (i < 0) hide(); else show(i); };
    const under = (el: Element | null) => { const w = el && el.closest ? el.closest('.doorway') : null; return w ? units.findIndex((u) => u.contains(w)) : -1; };
    S.on(window, 'pointermove', (e) => { px = e.clientX; py = e.clientY; set(under(e.target as Element)); }, { passive: true });
    S.on(window, 'scroll', () => { if (px >= 0) set(under(document.elementFromPoint(px, py))); }, { passive: true });
    S.on(root, 'pointerleave', () => set(-1));
    S.on(window, 'blur', () => set(-1));
    units.forEach((u, i) => {
      const w = must('.doorway', u);
      w.addEventListener('focus', () => { if (w.matches(':focus-visible')) set(i); });
      w.addEventListener('blur', () => { if (px < 0 || under(document.elementFromPoint(px, py)) !== i) set(-1); });
    });
    hooks.doorHover = set;
  } else if (!MOB.matches) dinfo.style.display = 'none';

  // phones: the wall stays pinned while you scroll; each stretch of scrolling (or a sideways swipe) moves one door along
  const mRow = must('.doors__row', sec);
  let mIdx = 0, mForce = -1, mShown = -1;
  const mSpan = () => Math.max(1, sec.offsetHeight - innerHeight);
  const mobY = (i: number) => sec.getBoundingClientRect().top + pageYOffset + (Math.min(3, Math.max(0, i)) / 3) * mSpan();
  const mDots = $('.doors__dots', sec);
  let mCur = 0, mRaf = 0, mLast = 0, mSettle = 0, swipeLock = 0;
  // scroll progress across the pinned wall → a door position that rests on each door and glides between them
  const mDwell = (f: number) => { const i = Math.floor(f), t = f - i, u = Math.min(1, Math.max(0, (t - .2) / .6)); return i + u * u * (3 - 2 * u); };
  const mProgress = () => Math.min(1, Math.max(0, -sec.getBoundingClientRect().top / mSpan()));
  const mTarget = () => mForce >= 0 ? mForce : mDwell(mProgress() * 3);
  function mShow(i: number) {
    if (i === mShown) return;
    mShown = i; setInfo(i);
    mDots?.querySelectorAll('i').forEach((d, k) => d.classList.toggle('on', k === Math.min(3, i)));
    dinfo.getAnimations().forEach((a) => a.cancel());
    if (!reduced) dinfo.animate([{ opacity: 0, transform: 'translateY(.4rem)' }, { opacity: 1, transform: 'none' }], { duration: 360, easing: 'cubic-bezier(.16,1,.3,1)' });
  }
  function mFrame(now: number) {
    mRaf = 0;
    if (!MOB.matches) { mRow.style.transform = ''; return; }
    const dt = Math.min(64, now - (mLast || now)); mLast = now;
    const t = mTarget();
    mCur = reduced ? t : mCur + (t - mCur) * Math.min(1, dt / 1000 * 10);
    mCur = Math.max(t - 1, Math.min(t + 1, mCur));
    if (Math.abs(t - mCur) < .001) mCur = t;
    const step = units[1].offsetLeft - units[0].offsetLeft;
    mRow.style.transform = `translate3d(${(-mCur * step).toFixed(2)}px,0,0)`;
    mIdx = Math.round(t); mShow(mForce >= 0 ? mForce : mIdx);
    if (mCur !== t) mRaf = S.raf(mFrame);
  }
  function mApply() { if (!mRaf) mRaf = S.raf(mFrame); }
  // the door takes exactly the height left under the text; on short screens the checklist steps aside for it
  const mPin = must('.doors__pin', sec);
  function mSize() {
    if (!MOB.matches) { mPin.style.removeProperty('--uw'); sec!.classList.remove('compact'); return; }
    const fit = () => {
      const pr = mPin.getBoundingClientRect(), rr = mRow.getBoundingClientRect();
      const avail = pr.bottom - rr.top - parseFloat(getComputedStyle(mRow).paddingTop) - 2;
      return Math.min(innerWidth * .6, avail / 2.25);
    };
    sec!.classList.remove('compact');
    let w = fit();
    if (w < 150) { sec!.classList.add('compact'); w = fit(); }
    mPin.style.setProperty('--uw', Math.max(110, w).toFixed(1) + 'px');
    mApply();
  }
  mSize(); S.on(window, 'resize', mSize); document.fonts?.ready.then(() => { if (!S.dead) mSize(); });
  // when scrolling stops part-way between two doors, ease the page onto the nearest one
  const mGo = (top: number) => snapTo(top);
  function mFromScroll() {
    if (!MOB.matches || busy) return;
    mApply();
    clearTimeout(mSettle);
    mSettle = S.timeout(function settle() {
      if (st.touching) { mSettle = S.timeout(settle, 120); return; }
      if (busy || mForce >= 0 || performance.now() < swipeLock) return;
      const r = sec!.getBoundingClientRect(); if (r.top > 0 || r.bottom < innerHeight) return;   // only while the wall is pinned
      const want = mobY(Math.round(mProgress() * 3));
      if (Math.abs(pageYOffset - want) > 2) mGo(want);
    }, 220);
  }
  S.on(window, 'scroll', mFromScroll, { passive: true });
  S.on(window, 'resize', () => { mFromScroll(); mApply(); });
  // a sideways swipe steps exactly one door from where the finger landed, however much the page moved meanwhile
  let tx0 = 0, ty0 = 0, i0 = 0;
  sec.addEventListener('touchstart', (e) => { tx0 = e.touches[0].clientX; ty0 = e.touches[0].clientY; i0 = Math.round(mProgress() * 3); }, { passive: true });
  sec.addEventListener('touchend', (e) => {
    if (!MOB.matches || busy || mForce >= 0) return;
    const dx = e.changedTouches[0].clientX - tx0, dy = e.changedTouches[0].clientY - ty0;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    const to = Math.min(3, Math.max(0, i0 + (dx < 0 ? 1 : -1)));
    swipeLock = performance.now() + 700;
    mGo(mobY(to));
  }, { passive: true });
  if (MOB.matches) { mShown = -1; mShow(0); dinfo.classList.add('on'); mCur = mTarget(); mApply(); }
  S.on(MOB, 'change', () => { mForce = -1; mShown = -1; mFromScroll(); mApply(); if (MOB.matches) dinfo.classList.add('on'); });

  // the Photography door sits just past the end of the wall: only the menu (or its link) slides the wall along to it
  const SECRET = 4, secretUnit = units[SECRET];
  function reveal(on: boolean) {
    sec!.classList.toggle('reveal', on);
    if (on) secretUnit.removeAttribute('inert'); else secretUnit.setAttribute('inert', '');
  }
  hooks.openDoor = (i: number) => {
    if (busy || inWall) return;
    const top = MOB.matches ? mobY(Math.min(i, 3)) : sec.getBoundingClientRect().top + pageYOffset;
    const far = Math.abs(pageYOffset - top) > 4;
    if (far) { if (st.lenis) st.lenis.scrollTo(top, { duration: .9, easing: (x) => 1 - Math.pow(1 - x, 3) }); else scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' }); }
    const t0 = performance.now();
    warm(i);
    const settle = () => {
      if (Math.abs(pageYOffset - top) > 24 && performance.now() - t0 < 1500) { S.raf(settle); return; }   // open as the scroll lands, not after its tail
      if (!ready[i] && performance.now() - t0 < 4000) { S.raf(settle); return; }   // the room is still loading
      let wait = 0;
      if (MOB.matches) {
        const want = i === SECRET ? SECRET : i, before = mForce >= 0 ? mForce : mIdx;
        if (i === SECRET) { reveal(true); mForce = SECRET; } else mIdx = i;
        mApply();
        if (want !== before) wait = reduced ? 0 : 560;
      } else if (i === SECRET && !sec.classList.contains('reveal')) { reveal(true); wait = reduced ? 0 : 850; }
      S.timeout(() => enter(i), wait);
    };
    S.raf(settle);
  };
  function enter(i: number) {
    if (busy) return;
    busy = true; warm(i); lift();
    showBadge(false);
    hooks.doorHover?.(-1); sec!.classList.remove('focus'); units.forEach((u) => u.classList.remove('on')); dinfo.classList.remove('on');
    const d = doorsState[i];
    doorsState.forEach((o, k) => { if (k !== i) o.s.set(0); });
    d.u.classList.add('press');
    S.timeout(() => d.u.classList.remove('press'), 380);
    S.timeout(() => d.s.set(ANG_WALK / ANG), reduced ? 0 : 170);
    S.timeout(() => through(i), reduced ? 0 : 760);
  }

  // walk through: the whole wall scales up around the lit gap beside the open door until
  // the room behind fills the screen, then the room's own page takes over from the same picture
  // walking through: one GPU-only move. The wall of doors scales up around the dark gap beside the
  // open door until that darkness fills the screen; then the room's photos float in out of it.
  let walkRaf = 0;
  const dark = must('#passage'), shade = must('#shade');
  // freezes scrolling without touching layout (a layout change here is what caused a stall)
  const swallow = (e: Event) => e.preventDefault();
  const keysStop = (e: KeyboardEvent) => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(e.key) && !inWall) e.preventDefault(); };
  let holdOffs: (() => void)[] = [];
  function holdScroll(on: boolean) {
    if (on) {
      st.lenis?.stop();
      holdOffs.forEach((off) => off());
      holdOffs = [S.on(window, 'wheel', swallow, { passive: false }), S.on(window, 'touchmove', swallow, { passive: false }), S.on(window, 'keydown', keysStop)];
    } else { st.lenis?.start(); holdOffs.forEach((off) => off()); holdOffs = []; }
  }
  function through(i: number) {
    const u = units[i];
    const r = must('.opening', u).getBoundingClientRect();
    const dr = must('.door', u).getBoundingClientRect();
    const gapL = Math.min(Math.max(dr.right, r.left), r.right - 6);
    const gw = Math.max(r.right - gapL, 10), gh = r.height;
    const cx = (gapL + r.right) / 2, cy = r.top + gh * .5;
    holdScroll(true);
    $('#cord')?.classList.add('away'); $('.hdr')?.classList.add('away');
    const sr = sec!.getBoundingClientRect();
    sec!.style.transformOrigin = `${cx - sr.left}px ${cy - sr.top}px`;
    sec!.classList.add('through');
    const tx = innerWidth / 2 - cx, ty = innerHeight / 2 - cy;
    // walk straight through the doorway: the whole scene scales up around the gap, so the frame and door
    // slide out past the left and right edges and the room's own darkness is all that's left.
    // Driven per frame (not as a CSS animation) so the browser scales the existing layer instead of
    // re-rendering the scene at its final zoom first, which is what used to stall.
    const sEnd = Math.max(innerWidth / gw, innerHeight / gh) * 1.15;
    const ease = (x: number) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    const zoomOf = (e: number) => Math.exp(Math.log(sEnd) * e);                        // even speed of approach
    const t0 = performance.now(), D = reduced ? 1 : 1500;
    let handed = false;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / D), e = ease(p), sc = zoomOf(e);
      const f = Math.min(1, e * 1.6);                                            // drift the door to the centre early on
      sec!.style.transform = `translate(${tx * f}px, ${ty * f}px) scale(${sc})`;
      // the moment the dark covers the whole screen, the room takes over: no waiting in the blank
      if (!handed && (sc >= sEnd / 1.15 || p >= 1)) { handed = true; handoff(); }
      if (p < 1) walkRaf = S.raf(step);
    };
    walkRaf = S.raf(step);
    // as the dark fills the screen, the room takes over (same black, so it's invisible) and the photos start to float in
    function handoff() {
      pick(i);
      if (frameReady) {
        wallv.classList.add('on');
        S.timeout(() => {
          inWall = true;
          wallv.classList.add('live');
          try { history.pushState({ wall: 1 }, '', ROUTES[i]); pushed = true; } catch { pushed = false; }
          document.title = TITLES[i] + ' — Madhav';
          toWall({ wall: 'enter' });
          try { frame!.contentWindow!.focus(); } catch { /* frame gone */ }
        }, 0);
      } else {
        veil.innerHTML = ''; veil.className = 'veil veil--glow'; veil.style.clipPath = 'none'; veil.style.transition = 'none'; veil.hidden = false;
        S.raf(() => { location.href = ROUTES[i]; });
      }
    }
  }

  // leaving the room: photos sink back into the dark, you back out of the doorway, the door swings shut
  function leaveWall() {
    if (!inWall) return;
    inWall = false;
    wallv.classList.remove('live');
    document.title = DOC_TITLE;
    const d = doorsState[cur];
    toWall({ wall: 'exit' });
    S.timeout(() => {
      wallv.classList.remove('on');
      S.timeout(() => {
        cancelAnimationFrame(walkRaf);
        const from = sec!.style.transform, back = { finished: new Promise<void>((res) => {
          const m = /translate\(([-\d.]+)px, ([-\d.]+)px\) scale\(([\d.]+)\)/.exec(from) || [0, 0, 0, 1];
          const X = +m[1], Y = +m[2], Sc = +m[3], t0 = performance.now(), D = reduced ? 1 : 1300;
          const ease = (x: number) => 1 - Math.pow(1 - x, 3);
          const step = (now: number) => {
            const p = Math.min(1, (now - t0) / D), e = ease(p);
            const sc = Math.exp(Math.log(Sc) * (1 - e));
            sec!.style.transform = `translate(${X * (1 - e)}px, ${Y * (1 - e)}px) scale(${sc})`;
            if (p < 1) S.raf(step); else { sec!.style.transform = ''; res(); }
          };
          S.raf(step);
        }) };
        back.finished.then(() => {
          if (S.dead) return;
          cancelAnimationFrame(walkRaf); sec!.style.transform = ''; dark.hidden = true; shade.hidden = true;
          sec!.classList.remove('through', 'lift'); sec!.style.transformOrigin = '';
          d.s.set(0);
          $('#cord')?.classList.remove('away'); $('.hdr')?.classList.remove('away');
          busy = false;
          holdScroll(false);
          toWall({ wall: 'reset' });
          if (afterLeave) { const f = afterLeave; afterLeave = null; S.timeout(f, 60); }
          if (cur === SECRET) {
            // back out, then the wall slides back and the Photography door is hidden again
            if (MOB.matches) { mForce = -1; mFromScroll(); mApply(); S.timeout(() => reveal(false), reduced ? 0 : 580); }
            else S.timeout(() => reveal(false), reduced ? 0 : 500);
            must('.doorway', units[SECRET - 1]).focus({ preventScroll: true });
          } else d.way.focus({ preventScroll: true });
        });
      }, reduced ? 0 : 360);
    }, reduced ? 0 : 520);
  }
  const DOC_TITLE = document.title;
  let afterLeave: (() => void) | null = null;
  S.on(window, 'message', (e) => {
    if (e.source !== frame?.contentWindow || !e.data) return;
    if (e.data.wall === 'go') {
      // a link in the room's navbar or footer
      const to = String(e.data.to || '');
      if (to === 'contact') { hooks.openModal?.(); return; }                         // the request form opens right over the room
      const n = to.startsWith('door:') ? +to.slice(5) : -1;
      if (n === cur) return;
      afterLeave = () => { if (n >= 0) hooks.openDoor?.(n); else scrollToId(S, to === 'about' ? 'about' : 'home'); };
    } else if (e.data.wall !== 'close') return;
    if (pushed) { pushed = false; history.back(); } else leaveWall();
  });
  S.on(window, 'popstate', () => { if (inWall && !(history.state && history.state.wall)) { pushed = false; leaveWall(); } });
  S.on(window, 'keydown', (e) => { if (e.key === 'Escape' && inWall && must('#modal').hidden && must('#navm').hidden) { if (pushed) { pushed = false; history.back(); } else leaveWall(); } });
  // keep the room's light/dark in step with the cord
  S.observe(new MutationObserver(() => frames.forEach((f) => { try { f?.contentWindow?.postMessage({ wall: 'mode', mode: root.dataset.mode === 'dark' ? 'dark' : 'light' }, selfOrigin()); } catch { /* frame gone */ } })))
    .observe(root, { attributes: true, attributeFilter: ['data-mode'] });

  // coming back with the browser's Back button: put the wall and the door back as they were
  S.on(window, 'pageshow', (e) => {
    if (!busy && !e.persisted) return;
    cancelAnimationFrame(walkRaf); dark.hidden = true; shade.hidden = true;
    sec.classList.remove('through'); sec.style.transform = ''; sec.style.transformOrigin = ''; reveal(false);
    veil.classList.remove('on'); veil.hidden = true; veil.style.clipPath = ''; veil.innerHTML = '';
    wallv.classList.remove('on', 'live'); wallv.style.clipPath = '';
    $('#cord')?.classList.remove('away'); $('.hdr')?.classList.remove('away');
    doorsState.forEach((d) => d.s.set(0));
    if (busy) { busy = false; startScroll(); }
  });
}
