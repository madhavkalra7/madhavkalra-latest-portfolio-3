/** The graphic-design worlds (from the original page script). */

export interface Slide { f: string; w: number; h: number }
export interface Item extends Slide {
  k?: string;
  /** a carousel: the slides behind the cover */
  deck?: Slide[];
  title?: string;
  /** logos sit on a dark paper */
  dark?: boolean;
}
export interface World {
  k: string;
  /** the heading: plain part, then the part set in <em> (originally an HTML string, e.g. 'Qodoro <em>Realty</em>') */
  name: { pre?: string; em?: string };
  label: string;
  kicker: string;
  desc: string;
  tags: string[];
  bg: string; fg: string; acc: string;
  items: Item[];
}

type Keyed = Slide & { k: string };
const GD: { himspring: Keyed[]; qodoro: Keyed[]; kallisto: Keyed[]; wbt: { slides: Slide[]; title: string }[]; posters: Keyed[]; logos: Keyed[] } = {"himspring": [{"f": "him-27.webp", "w": 800, "h": 1000, "k": "him-27"}, {"f": "him-28.webp", "w": 800, "h": 1000, "k": "him-28"}, {"f": "him-31.webp", "w": 800, "h": 1000, "k": "him-31"}, {"f": "him-32.webp", "w": 800, "h": 1000, "k": "him-32"}, {"f": "him-33.webp", "w": 800, "h": 1000, "k": "him-33"}, {"f": "him-37.webp", "w": 800, "h": 1000, "k": "him-37"}, {"f": "him-43.webp", "w": 800, "h": 1000, "k": "him-43"}, {"f": "him-44.webp", "w": 800, "h": 1000, "k": "him-44"}, {"f": "him-45.webp", "w": 800, "h": 1000, "k": "him-45"}, {"f": "him-47.webp", "w": 800, "h": 1000, "k": "him-47"}, {"f": "him-49.webp", "w": 800, "h": 1000, "k": "him-49"}], "qodoro": [{"f": "qod-1.webp", "w": 800, "h": 1000, "k": "qod-1"}, {"f": "qod-16.webp", "w": 800, "h": 1000, "k": "qod-16"}, {"f": "qod-17.webp", "w": 800, "h": 1000, "k": "qod-17"}, {"f": "qod-26.webp", "w": 800, "h": 1000, "k": "qod-26"}, {"f": "qod-27.webp", "w": 800, "h": 1000, "k": "qod-27"}, {"f": "qod-31.webp", "w": 800, "h": 1000, "k": "qod-31"}, {"f": "qod-32.webp", "w": 800, "h": 1000, "k": "qod-32"}, {"f": "qod-center.webp", "w": 800, "h": 1000, "k": "qod-center"}, {"f": "qod-left.webp", "w": 800, "h": 1000, "k": "qod-left"}], "kallisto": [{"f": "kal-post-1.webp", "w": 800, "h": 1000, "k": "kal-post-1"}, {"f": "kal-2.webp", "w": 800, "h": 1000, "k": "kal-2"}, {"f": "kal-post-2.webp", "w": 800, "h": 1000, "k": "kal-post-2"}, {"f": "kal-post-3.webp", "w": 1000, "h": 1000, "k": "kal-post-3"}, {"f": "kal-post-4.webp", "w": 800, "h": 1000, "k": "kal-post-4"}, {"f": "kal-story-2.webp", "w": 562, "h": 1000, "k": "kal-story-2"}, {"f": "kal-story-4.webp", "w": 562, "h": 1000, "k": "kal-story-4"}, {"f": "kal-story-7.webp", "w": 562, "h": 1000, "k": "kal-story-7"}, {"f": "kal-story-8.webp", "w": 562, "h": 1000, "k": "kal-story-8"}, {"f": "kal-story-9.webp", "w": 562, "h": 1000, "k": "kal-story-9"}], "wbt": [{"slides": [{"f": "wbt-railway-1.webp", "w": 800, "h": 1000}, {"f": "wbt-railway-2.webp", "w": 800, "h": 1000}, {"f": "wbt-railway-3.webp", "w": 800, "h": 1000}, {"f": "wbt-railway-4.webp", "w": 800, "h": 1000}, {"f": "wbt-railway-5.webp", "w": 800, "h": 1000}, {"f": "wbt-railway-6.webp", "w": 800, "h": 1000}], "title": "AI in Railway"}, {"slides": [{"f": "wbt-stadium-1.webp", "w": 800, "h": 1000}, {"f": "wbt-stadium-2.webp", "w": 800, "h": 1000}, {"f": "wbt-stadium-3.webp", "w": 800, "h": 1000}, {"f": "wbt-stadium-4.webp", "w": 800, "h": 1000}, {"f": "wbt-stadium-5.webp", "w": 800, "h": 1000}, {"f": "wbt-stadium-6.webp", "w": 800, "h": 1000}, {"f": "wbt-stadium-7.webp", "w": 800, "h": 1000}], "title": "AI in stadium"}, {"slides": [{"f": "wbt-edtech-1.webp", "w": 800, "h": 1000}, {"f": "wbt-edtech-2.webp", "w": 800, "h": 1000}, {"f": "wbt-edtech-3.webp", "w": 800, "h": 1000}, {"f": "wbt-edtech-4.webp", "w": 800, "h": 1000}, {"f": "wbt-edtech-5.webp", "w": 800, "h": 1000}, {"f": "wbt-edtech-6.webp", "w": 800, "h": 1000}, {"f": "wbt-edtech-7.webp", "w": 800, "h": 1000}], "title": "Edtech"}, {"slides": [{"f": "wbt-kumbh-1.webp", "w": 800, "h": 1000}, {"f": "wbt-kumbh-2.webp", "w": 800, "h": 1000}, {"f": "wbt-kumbh-3.webp", "w": 800, "h": 1000}, {"f": "wbt-kumbh-4.webp", "w": 800, "h": 1000}, {"f": "wbt-kumbh-5.webp", "w": 800, "h": 1000}, {"f": "wbt-kumbh-6.webp", "w": 800, "h": 1000}, {"f": "wbt-kumbh-7.webp", "w": 800, "h": 1000}], "title": "mahakumbh"}], "posters": [{"f": "pos-theme.webp", "w": 1600, "h": 905, "k": "pos-theme"}, {"f": "pos-club-showcase.webp", "w": 562, "h": 1000, "k": "pos-club-showcase"}, {"f": "pos-recruitment-poster.webp", "w": 707, "h": 1000, "k": "pos-recruitment-poster"}, {"f": "pos-wbt-26-jan.webp", "w": 1000, "h": 1000, "k": "pos-wbt-26-jan"}], "logos": [{"f": "logo-foodicted.webp", "w": 500, "h": 500, "k": "logo-foodicted"}, {"f": "logo-wbt-logo.webp", "w": 1072, "h": 700, "k": "logo-wbt-logo"}, {"f": "logo-rishi-photography.webp", "w": 500, "h": 500, "k": "logo-rishi-photography"}]};

/** the file names are relative to the page: make them root-absolute */
const BASE = '/graphic-designer/';
const abs = <T extends Slide>(it: T): T => ({ ...it, f: BASE + it.f });

// a curated edit: the strongest pieces only, no near-duplicates and no plain lifestyle photos
const pick = (list: Keyed[], keys: string[]): Item[] => keys.map((k) => list.find((it) => it.k === k)).filter((it): it is Keyed => !!it).map(abs);
export const WORLDS: World[] = [
  { k: 'qodoro', name: { pre: 'Qodoro ', em: 'Realty' }, label: 'Qodoro Realty', kicker: 'Social campaign · Real estate',
    desc: 'Posts for a real-estate brand built on warm tones, editorial type and calm architecture and interiors, selling a feeling of home rather than square feet.',
    tags: ['Editorial layouts', 'Instagram posts', 'Brand guidelines'], bg: '#1A1818', fg: '#E8E4E0', acc: '#C4B0B0', items: pick(GD.qodoro, ['qod-1', 'qod-16', 'qod-17', 'qod-26', 'qod-27', 'qod-31', 'qod-32', 'qod-center', 'qod-left']) },
  { k: 'himspring', name: { em: 'Himspring' }, label: 'Himspring', kicker: 'Social campaign · Premium water',
    desc: 'A social campaign for a premium Himalayan water brand: cool light, clean headlines and quiet details that make a bottle of water feel like luxury.',
    tags: ['Art direction', 'Instagram posts', 'Brand voice'], bg: '#E8E4E0', fg: '#1A1818', acc: '#6B4F4F', items: pick(GD.himspring, ['him-27', 'him-28', 'him-31', 'him-32', 'him-33', 'him-37', 'him-43', 'him-44', 'him-45', 'him-47', 'him-49']) },
  { k: 'kallisto', name: { pre: 'Kallisto ', em: 'Miorah' }, label: 'Kallisto Miorah', kicker: 'Posts & stories · Fashion',
    desc: 'Posts and stories for a contemporary womenswear label: fashion-editorial layouts, product callouts and shop-the-look stories in soft, editorial tones.',
    tags: ['Fashion editorial', 'Posts & stories', 'Product callouts'], bg: '#C4B0B0', fg: '#1A1818', acc: '#4A3C3C', items: pick(GD.kallisto, ['kal-post-1', 'kal-2', 'kal-post-2', 'kal-post-3', 'kal-post-4', 'kal-story-2', 'kal-story-4', 'kal-story-7', 'kal-story-8', 'kal-story-9']) },
  { k: 'wbt', name: { pre: 'WeBuildTech' }, label: 'WeBuildTech', kicker: 'Carousels · AI company',
    desc: 'Swipe-through explainers for an AI company on crowd safety at railways, smarter stadiums, AI in EdTech and the Mahakumbh. Click a stack to swipe through it.',
    tags: ['Carousels', 'Information design', 'Storytelling'], bg: '#6B5C5C', fg: '#F3EEEC', acc: '#E8D6D6',
    items: GD.wbt.map((c) => { const deck = c.slides.map(abs); return { ...deck[0], deck, title: c.title }; }) },
  { k: 'posters', name: { pre: 'Posters & logos' }, label: 'Posters & logos', kicker: 'Events · Identity',
    desc: 'Posters for college fests and clubs, festive creatives and logo marks, from bold type-led launches to clean identities.',
    tags: ['Event posters', 'Logo design', 'Typography'], bg: '#1A1818', fg: '#E8E4E0', acc: '#C4B0B0',
    items: GD.posters.filter((p) => p.k !== 'pos-theme-launch').map(abs).concat(GD.logos.map((l) => ({ dark: true, ...abs(l) }))) },
];
