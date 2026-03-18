if (!self.define) {
  let e,
    s = {};
  const n = (n, c) => (
    (n = new URL(n + '.js', c).href),
    s[n] ||
      new Promise((s) => {
        if ('document' in self) {
          const e = document.createElement('script');
          ((e.src = n), (e.onload = s), document.head.appendChild(e));
        } else ((e = n), importScripts(n), s());
      }).then(() => {
        let e = s[n];
        if (!e) throw new Error(`Module ${n} didn’t register its module`);
        return e;
      })
  );
  self.define = (c, a) => {
    const t =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href;
    if (s[t]) return;
    let i = {};
    const r = (e) => n(e, t),
      o = { module: { uri: t }, exports: i, require: r };
    s[t] = Promise.all(c.map((e) => o[e] || r(e))).then((e) => (a(...e), i));
  };
}
define(['./workbox-4d767a27'], function (e) {
  'use strict';
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: '/_next/app-build-manifest.json',
          revision: 'afa6c310c5aa6b5305a931d771d6436b',
        },
        {
          url: '/_next/static/7HUn2cmk2CLCCYcZ7GSLE/_buildManifest.js',
          revision: 'c155cce658e53418dec34664328b51ac',
        },
        {
          url: '/_next/static/7HUn2cmk2CLCCYcZ7GSLE/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        {
          url: '/_next/static/chunks/117-54482fa8787b0730.js',
          revision: '7HUn2cmk2CLCCYcZ7GSLE',
        },
        {
          url: '/_next/static/chunks/197-b1663d928a80091c.js',
          revision: '7HUn2cmk2CLCCYcZ7GSLE',
        },
        {
          url: '/_next/static/chunks/388-e0ac427f61eedac3.js',
          revision: '7HUn2cmk2CLCCYcZ7GSLE',
        },
        {
          url: '/_next/static/chunks/648-35836f94a54ea93c.js',
          revision: '7HUn2cmk2CLCCYcZ7GSLE',
        },
        {
          url: '/_next/static/chunks/72-8f30f047ec871862.js',
          revision: '7HUn2cmk2CLCCYcZ7GSLE',
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-dbf0a246eb265207.js',
          revision: '7HUn2cmk2CLCCYcZ7GSLE',
        },
        {
          url: '/_next/static/chunks/app/agents/%5BagentId%5D/page-336634287134320a.js',
          revision: '7HUn2cmk2CLCCYcZ7GSLE',
        },
        {
          url: '/_next/static/chunks/app/agents/page-10607cd9686e3786.js',
          revision: '7HUn2cmk2CLCCYcZ7GSLE',
        },
        {
          url: '/_next/static/chunks/app/brackets/page-3a358859301e4199.js',
          revision: '7HUn2cmk2CLCCYcZ7GSLE',
        },
        {
          url: '/_next/static/chunks/app/community/page-4e05d5ebc74bd8fd.js',
          revision: '7HUn2cmk2CLCCYcZ7GSLE',
        },
        {
          url: '/_next/static/chunks/app/layout-77e5ba4cf20d0a4b.js',
          revision: '7HUn2cmk2CLCCYcZ7GSLE',
        },
        {
          url: '/_next/static/chunks/app/live/page-9b8e4b62bb248de2.js',
          revision: '7HUn2cmk2CLCCYcZ7GSLE',
        },
        {
          url: '/_next/static/chunks/app/map/page-70e2136b840ee91f.js',
          revision: '7HUn2cmk2CLCCYcZ7GSLE',
        },
        {
          url: '/_next/static/chunks/app/page-9c7543154436aebe.js',
          revision: '7HUn2cmk2CLCCYcZ7GSLE',
        },
        {
          url: '/_next/static/chunks/app/preferences/page-34750b878b6a446a.js',
          revision: '7HUn2cmk2CLCCYcZ7GSLE',
        },
        {
          url: '/_next/static/chunks/app/standings/page-909ccab3aa46a626.js',
          revision: '7HUn2cmk2CLCCYcZ7GSLE',
        },
        {
          url: '/_next/static/chunks/app/stats/page-12708e86fa5a5f74.js',
          revision: '7HUn2cmk2CLCCYcZ7GSLE',
        },
        {
          url: '/_next/static/chunks/app/teams/%5BteamId%5D/page-03ba137f2ae59867.js',
          revision: '7HUn2cmk2CLCCYcZ7GSLE',
        },
        {
          url: '/_next/static/chunks/app/teams/page-45f42e3ee39275da.js',
          revision: '7HUn2cmk2CLCCYcZ7GSLE',
        },
        {
          url: '/_next/static/chunks/fd9d1056-4a9853f3fae16b4a.js',
          revision: '7HUn2cmk2CLCCYcZ7GSLE',
        },
        {
          url: '/_next/static/chunks/framework-f66176bb897dc684.js',
          revision: '7HUn2cmk2CLCCYcZ7GSLE',
        },
        {
          url: '/_next/static/chunks/main-app-437c2dc04700b14c.js',
          revision: '7HUn2cmk2CLCCYcZ7GSLE',
        },
        {
          url: '/_next/static/chunks/main-cf6fd078793d78f7.js',
          revision: '7HUn2cmk2CLCCYcZ7GSLE',
        },
        {
          url: '/_next/static/chunks/pages/_app-72b849fbd24ac258.js',
          revision: '7HUn2cmk2CLCCYcZ7GSLE',
        },
        {
          url: '/_next/static/chunks/pages/_error-7ba65e1336b92748.js',
          revision: '7HUn2cmk2CLCCYcZ7GSLE',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        {
          url: '/_next/static/chunks/webpack-fd0bb4455e8e0036.js',
          revision: '7HUn2cmk2CLCCYcZ7GSLE',
        },
        {
          url: '/_next/static/css/f341a8b60c1586a8.css',
          revision: 'f341a8b60c1586a8',
        },
        {
          url: '/_next/static/media/4473ecc91f70f139-s.p.woff',
          revision: '78e6fc13ea317b55ab0bd6dc4849c110',
        },
        {
          url: '/_next/static/media/463dafcda517f24f-s.p.woff',
          revision: 'cbeb6d2d96eaa268b4b5beb0b46d9632',
        },
        {
          url: '/icon-128x128.png',
          revision: '277289ad5394b90df7f04f2ca2af05aa',
        },
        {
          url: '/icon-144x144.png',
          revision: '1cda68eca5d93cbe7496106b45cf50e0',
        },
        {
          url: '/icon-152x152.png',
          revision: 'f2ae948beb454a0fdcdb67a3175a5337',
        },
        {
          url: '/icon-192x192.png',
          revision: '369ff8751373339454c78b7cfe19c73c',
        },
        {
          url: '/icon-384x384.png',
          revision: '376400421f345e5dbdf63914f225369e',
        },
        {
          url: '/icon-512x512.png',
          revision: '22270e4a2887768b32967deedfea2d4f',
        },
        {
          url: '/icon-72x72.png',
          revision: '9aa71f8c4053992563e3e0128a70fc8a',
        },
        {
          url: '/icon-96x96.png',
          revision: '3be1cd12078f4db750f66631030db09d',
        },
        { url: '/manifest.json', revision: '04b7b3aaef7572cac777cb5b8eb6163e' },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: n,
              state: c,
            }) =>
              s && 'opaqueredirect' === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: 'OK',
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.googleapis\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.gstatic\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-static',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ));
});
