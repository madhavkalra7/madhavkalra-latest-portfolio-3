import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// No <StrictMode>: the pages drive real browser state (scroll locks, fullscreen, history.replaceState,
// iframes) and the original site ran each script exactly once. Behaviours still clean up fully on unmount.
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
