import type { Behavior } from '../../lib/scope';
import { fullscreen } from '../../behaviors/fullscreen';
import { skeletons, backToDoors, roomNav } from '../../behaviors/rooms';
import { footer } from '../../behaviors/footer';
import { analytics } from '../../behaviors/analytics';
import { projectStack } from './stack';
import { embedBridge } from './embed';

// ported page behaviours, in original script order (00-head.js is the pre-paint script in index.html)
export const behaviors: Behavior[] = [
  projectStack,                     // 01 project cards: recordings, self-scrolling screenshots, stacking
  embedBridge,                      // 02 messages from the home page when shown inside its iframe
  fullscreen,                       // 03
  skeletons('main img, main video'), // 04
  footer,                           // 05
  backToDoors,                      // 06
  roomNav,                          // 07
  analytics,                        // 08
];
