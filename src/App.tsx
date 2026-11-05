import { lazy, Suspense, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// One route per page of the original site. Pages are split so each loads only its own code
// (the ability card pulls in three.js; nothing else should).
const HomePage = lazy(() => import('./pages/home/HomePage'));
const WebDeveloperPage = lazy(() => import('./pages/web-developer/WebDeveloperPage'));
const AppDeveloperPage = lazy(() => import('./pages/app-developer/AppDeveloperPage'));
const UiUxDesignerPage = lazy(() => import('./pages/ui-ux-designer/UiUxDesignerPage'));
const GraphicDesignerPage = lazy(() => import('./pages/graphic-designer/GraphicDesignerPage'));
const PhotographerPage = lazy(() => import('./pages/photographer/PhotographerPage'));
const LegalPage = lazy(() => import('./pages/legal/LegalPage'));
const AbilityCardPage = lazy(() => import('./pages/ability-card/AbilityCardPage'));

export default function App() {
  // Every page of the original site is its own document, and the home page writes to the history itself
  // (/home → /work → /my-story while scrolling; a door pushes /web-developer/ while you stand in that room,
  // which is still the home page). So the page is chosen once, from the address the document was loaded at,
  // and links between pages are ordinary full navigations, exactly as on the live site.
  const [location] = useState(() => ({ pathname: window.location.pathname, search: window.location.search, hash: '', state: null, key: 'load' }));
  return (
    <Suspense fallback={null}>
      <Routes location={location}>
        {/* the home page rewrites its address to /home, /work or /my-story as you scroll */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/work" element={<HomePage />} />
        <Route path="/my-story" element={<HomePage />} />
        <Route path="/web-developer" element={<WebDeveloperPage />} />
        <Route path="/app-developer" element={<AppDeveloperPage />} />
        <Route path="/ui-ux-designer" element={<UiUxDesignerPage />} />
        <Route path="/graphic-designer" element={<GraphicDesignerPage />} />
        <Route path="/photographer" element={<PhotographerPage />} />
        <Route path="/legal" element={<LegalPage />} />
        <Route path="/ability-card" element={<AbilityCardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
