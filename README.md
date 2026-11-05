# therishithakor.com: React + TypeScript

A local, editable React 19 + TypeScript (Vite) rebuild of https://therishithakor.com. It keeps the same pages, styles, assets and interactions as the live site.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build at http://localhost:4173
```

## Pages

| URL | Component |
| --- | --- |
| `/` (also `/home`, `/work`, `/my-story`) | `src/pages/home/HomePage.tsx` |
| `/web-developer/` | `src/pages/web-developer/WebDeveloperPage.tsx` |
| `/app-developer/` | `src/pages/app-developer/AppDeveloperPage.tsx` |
| `/ui-ux-designer/` | `src/pages/ui-ux-designer/UiUxDesignerPage.tsx` |
| `/graphic-designer/` | `src/pages/graphic-designer/GraphicDesignerPage.tsx` |
| `/photographer/` | `src/pages/photographer/PhotographerPage.tsx` |
| `/legal/` | `src/pages/legal/LegalPage.tsx` |
| `/ability-card/` | `src/pages/ability-card/AbilityCardPage.tsx` (three.js card, opened in a frame from the home page) |

## Layout

```
index.html                  pre-paint script (light/dark mode, embed/lite flags) + React mount point
src/
  main.tsx, App.tsx         entry point and routes
  lib/
    scope.ts                Scope: tracks listeners/timers/frames/observers so a page cleans up on unmount
    hooks.ts                usePageStyles (page stylesheet while mounted), useBehaviors (run page behaviours)
    dom.ts                  typed querySelector helpers
  behaviors/                behaviours shared by several pages (footer, back-to-top, fullscreen, analytics, room navbar…)
  pages/<page>/
    <Page>.tsx              the page markup (JSX) and its <title>/<meta>
    <page>.css              the page's stylesheet
    behaviors.ts            the page's interactions, in order (and any extra modules they import)
    data.ts                 content arrays rendered with .map() (projects, photos…), where the page has them
public/                     images, videos, fonts and icons at the same paths as the live site
```

### How a page works

1. The `<Page>.tsx` component renders the markup.
2. `usePageStyles(css)` injects that page's stylesheet while the page is mounted. Each original page has its own complete stylesheet, including `:root` and `body` rules, so the stylesheets are not global.
3. `useBehaviors(...)` runs the page's interactions after mount: animations, scroll effects, the pull cord, doors, lightboxes and so on. Each behaviour registers its listeners, timers, animation frames and observers through a `Scope`, and all of them are removed on unmount.

### Editing

- **Text, images, links:** edit the JSX in `<Page>.tsx`, or the page's `data.ts` for project and photo lists.
- **Styles:** edit `<page>.css`. The class names match the original site.
- **Interactions:** edit the page's behaviour modules. They find elements by class or id, so keep those in sync when you rename things in the JSX.

### Notes

- **Links between pages** are normal full-page navigations, as on the live site. The home page writes to the address bar itself: it shows `/home`, `/work` or `/my-story` while you scroll, and a room's URL while you stand inside one of its doors. The router therefore picks the page once, from the URL the document was loaded at.
- **Rooms inside the home page:** the home page loads each room page in an iframe with `?embed`. It also loads the ability card in an iframe. The frames and the home page talk over `postMessage`.
- **Ability card engine:** `src/pages/ability-card/engine/holoCard.js` is the site's original compiled three.js scene module (about 7,700 lines), kept as-is. `three` comes from npm at r180, the same version as the live site. The TypeScript page around it prepares what the engine expects and relays its progress to the home page.
- **Ability card frame and CORS:** the card's iframe is sandboxed, so its requests come from origin `null`. `vite.config.ts` allows that origin for dev and preview. When you deploy, the host must send `Access-Control-Allow-Origin` for scripts and fonts, as the live Netlify site does (`*`).
- **Contact form:** the form posts to Netlify Forms only on the live domain. Anywhere else, including localhost, it opens an email draft, as the original does.
- **Analytics:** Google Analytics loads only after a visitor clicks "Allow" in the cookie banner.
