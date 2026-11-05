import type { Behavior } from '../../lib/scope';
import { footer } from '../../behaviors/footer';
import { fullscreen } from '../../behaviors/fullscreen';
import { analytics } from '../../behaviors/analytics';
import { story } from './behaviors/story';
import { adaptiveGrid, scrollLock } from './behaviors/state';
import { liveClock, stickyHeader } from './behaviors/header';
import { overlays } from './behaviors/overlays';
import { flipCalendar } from './behaviors/calendar';
import { reveal } from './behaviors/reveal';
import { mode } from './behaviors/mode';
import { pullCord } from './behaviors/cord';
import { doors } from './behaviors/doors';
import { cleanRoutes, pageLoader } from './behaviors/loader';
import { abilityCard } from './behaviors/abilityCard';
import { smoothScroll } from './behaviors/lenis';

/*
 * The home page's scripts in the order the browser ran them. The classic scripts (02 footer, 03 fullscreen,
 * 06 my story, 07 analytics) ran while the document was parsed; the big module (05) is deferred, so it ran after
 * all of them. 04 was the import map for `lenis` (now the npm package).
 */
export const behaviors: Behavior[] = [
  footer,          // 02
  fullscreen,      // 03
  story,           // 06
  analytics,       // 07
  // 05-body-module.js, section by section, in its own order
  adaptiveGrid,
  scrollLock,
  stickyHeader,
  liveClock,
  overlays,        // nav menu, request modal, in-page routing, declarative hovers
  flipCalendar,
  reveal,
  mode,
  pullCord,
  doors,
  pageLoader,
  cleanRoutes,
  abilityCard,
  smoothScroll,    // the module's closing top-level `await import('lenis')`
];
