/** The full-screen menu: [label, target]. A number opens that door, 'home'/'about' scroll there, null opens the request form. */
export const NAV: readonly (readonly [string, string | number | null])[] = [
  ['Home', 'home'], ['Web Development', 0], ['App Development', 1], ['UI/UX Design', 2], ['Graphic Design', 3], ['My story', 'about'], ['Contact', null],
];
