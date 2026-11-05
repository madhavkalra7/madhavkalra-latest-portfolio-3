import type { Behavior } from '../../lib/scope';
import { fullscreen } from '../../behaviors/fullscreen';
import { skeletons, backToDoors, roomNav } from '../../behaviors/rooms';
import { footer } from '../../behaviors/footer';
import { analytics } from '../../behaviors/analytics';
import { gallery } from './gallery';
import { embedBridge } from './embed';

// the page's scripts, in original document order (00-head.js is the pre-paint script in index.html)
export const behaviors: Behavior[] = [
  gallery,                            // 01: the worlds (washing lines of prints) and the lightbox
  embedBridge,                        // 02: inside the home page's frame
  fullscreen,                         // 03
  skeletons('main img, main video'),  // 04
  footer,                             // 05
  backToDoors,                        // 06
  roomNav,                            // 07
  analytics,                          // 08
];
