// Modo sin conexión de Caja POS.
// Al instalar guarda todos los archivos de la app; después la abre desde el
// teléfono aunque no haya internet. Cada versión nueva usa su propia caché.
const VERSION = '27';
const CACHE = 'caja-pos-' + VERSION;
const FILES = [
 "./",
 "./assets/AssetManifest.bin.json",
 "./assets/FontManifest.json",
 "./assets/NOTICES",
 "./assets/assets/fonts/Inter-Bold.ttf",
 "./assets/assets/fonts/Inter-ExtraBold.ttf",
 "./assets/assets/fonts/Inter-Medium.ttf",
 "./assets/assets/fonts/Inter-Regular.ttf",
 "./assets/assets/fonts/Inter-SemiBold.ttf",
 "./assets/assets/icon/icono-1024.png",
 "./assets/assets/icon/ios-1024.png",
 "./assets/fonts/MaterialIcons-Regular.otf",
 "./assets/fonts/fallback/Roboto-Regular.ttf",
 "./assets/shaders/ink_sparkle.frag",
 "./assets/shaders/stretch_effect.frag",
 "./canvaskit/canvaskit.js",
 "./canvaskit/canvaskit.wasm",
 "./canvaskit/chromium/canvaskit.js",
 "./canvaskit/chromium/canvaskit.wasm",
 "./favicon.png",
 "./flutter.js",
 "./flutter_bootstrap.js",
 "./icons/Icon-192.png",
 "./icons/Icon-512.png",
 "./icons/Icon-maskable-192.png",
 "./icons/Icon-maskable-512.png",
 "./icons/apple-touch-icon.png",
 "./index.html",
 "./main.dart.js",
 "./manifest.json",
 "./sqflite_sw.js",
 "./sqlite3.wasm",
 "./version.json"
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('caja-pos-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(CACHE).then((c) =>
      c.match(req, { ignoreSearch: true }).then((hit) =>
        hit ||
        fetch(req).then((res) => {
          if (res.ok) c.put(req, res.clone());
          return res;
        }).catch(() => c.match('./index.html'))
      )
    )
  );
});
