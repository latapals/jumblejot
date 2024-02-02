/*
 Probably one of the simplest functional service workers
 
 Version: 0.0.2
*/

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('pwa-assets').then(cache => 
      {
        return cache.addAll([
          'app/index.html'
        ])
      })
  );
});

self.addEventListener('load', e => {
  e.waitUntil(
    caches.open('pwa-assets').then(cache => 
      {
        return cache.addAll([
          'app/index.html'
        ])
      })
  );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            return caches.match(event.request)
        })
    )
})
