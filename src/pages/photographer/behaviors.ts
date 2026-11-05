import type { Behavior } from '../../lib/scope';
import { fullscreen } from '../../behaviors/fullscreen';
import { analytics } from '../../behaviors/analytics';
import { skeletons } from '../../behaviors/rooms';
import { wall } from './wall';

// ported page behaviours, in original script order
// (00-head.js is the pre-paint script in index.html; 01 `<script src="photos.js">` is now the photos.ts module)
export const behaviors: Behavior[] = [
  wall,                  // 02 the photo wall: layout, camera, sky, lightbox, messages from the home page
  fullscreen,            // 03
  skeletons('.ph img'),  // 04 shimmering placeholders until each photo has loaded
  analytics,             // 05
];
