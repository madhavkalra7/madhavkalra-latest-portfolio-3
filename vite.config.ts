import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The home page opens the ability card in a sandboxed iframe (sandbox="allow-scripts"), whose origin is "null".
// Its module scripts and fonts are cross-origin requests from that frame, so the server must allow the "null"
// origin (the live site sends Access-Control-Allow-Origin: * for the same reason). Only localhost and "null" here.
const cors = { origin: [/^https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/, 'null'] };

// The site is a single-page React app. Every original page path (/, /home, /work, /my-story,
// /web-developer/, …) falls back to index.html and is resolved by react-router.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, cors },
  preview: { port: 4173, cors },
});
