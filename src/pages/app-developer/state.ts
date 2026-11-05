/**
 * State shared by the room's two page scripts (the card stack and the embed bridge).
 * The original kept these on `window` (`__live`, `__liveT`, `__restartAll`, and the global `checkHidden`).
 */
const noop = () => {};

export const room = {
  /** inside the home page the room is loaded early, out of sight: nothing plays until you have walked in and it has faded up */
  live: false,
  /** the timer that turns `live` on after the room has faded up */
  liveT: 0,
  /** note which screens are out of sight and restart those (stack.ts) */
  checkHidden: noop as () => void,
  /** every screen back to the top (stack.ts) */
  restartAll: noop as () => void,
};
