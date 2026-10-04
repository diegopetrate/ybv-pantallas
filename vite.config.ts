import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Each screen is its own Netlify site, built from the same repository with `--mode <app>`. */
const APPS = {
  gacetilla: { name: 'Yellow Blue Vase · Gacetilla', short: 'Gacetilla', port: 5176 },
  chiara: { name: 'Yellow Blue Vase · Chiara Scarpitti', short: 'Chiara Scarpitti', port: 5177 },
} as const;
type App = keyof typeof APPS;

const repository = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(({ mode }) => {
  const app: App = mode in APPS ? (mode as App) : 'gacetilla';
  const root = resolve(repository, 'apps', app);
  return {
    root,
    publicDir: resolve(root, 'public'),
    // Dropbox locks node_modules/.vite while it syncs, so Vite keeps its cache outside it.
    cacheDir: join(tmpdir(), 'ybv-pantallas-vite', app),
    server: { port: APPS[app].port, host: true, fs: { allow: [repository] } },
    preview: { port: APPS[app].port },
    build: {
      outDir: resolve(repository, 'dist', app),
      emptyOutDir: true,
      // Television browsers lag behind desktop ones.
      target: 'es2019',
      cssTarget: 'chrome79',
    },
    plugins: [
      // The screens keep running if the venue's network drops: everything is cached on first load.
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: APPS[app].name,
          short_name: APPS[app].short,
          theme_color: '#03070e',
          background_color: '#03070e',
          display: 'fullscreen',
          orientation: 'landscape',
          icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
        },
        workbox: {
          globPatterns: ['**/*.{html,js,css,woff,woff2,svg,jpg,png,webp}'],
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
          navigateFallback: '/index.html',
        },
      }),
    ],
  };
});
