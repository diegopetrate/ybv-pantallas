import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** One Netlify site, like Yellow Blue Vase's /1 … /4: each screen lives under its own path and is
 * built with `--mode <app>` into dist/<path>. */
const APPS = {
  gacetilla: { path: 'app1', name: 'Yellow Blue Vase · Gacetilla', short: 'Gacetilla', port: 5176 },
  chiara: { path: 'app2', name: 'Yellow Blue Vase · Chiara Scarpitti', short: 'Chiara Scarpitti', port: 5177 },
} as const;
type App = keyof typeof APPS;

const repository = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(({ mode }) => {
  const app: App = mode in APPS ? (mode as App) : 'gacetilla';
  const root = resolve(repository, 'apps', app), base = `/${APPS[app].path}/`;
  return {
    root,
    base,
    publicDir: resolve(root, 'public'),
    // Dropbox locks node_modules/.vite while it syncs, so Vite keeps its cache outside it.
    cacheDir: join(tmpdir(), 'ybv-pantallas-vite', app),
    server: { port: APPS[app].port, host: true, fs: { allow: [repository] } },
    preview: { port: APPS[app].port },
    build: {
      outDir: resolve(repository, 'dist', APPS[app].path),
      emptyOutDir: true,
      // Television browsers lag behind desktop ones.
      target: 'es2019',
      cssTarget: 'chrome79',
    },
    plugins: [
      // The screens keep running if the venue's network drops: everything is cached on first load.
      // Each screen's service worker stays within its own path.
      VitePWA({
        registerType: 'autoUpdate',
        scope: base,
        manifest: {
          name: APPS[app].name,
          short_name: APPS[app].short,
          start_url: base,
          scope: base,
          theme_color: '#03070e',
          background_color: '#03070e',
          display: 'fullscreen',
          orientation: 'landscape',
          icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
        },
        workbox: {
          globPatterns: ['**/*.{html,js,css,woff,woff2,svg,jpg,png,webp}'],
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
          navigateFallback: `${base}index.html`,
        },
      }),
    ],
  };
});
