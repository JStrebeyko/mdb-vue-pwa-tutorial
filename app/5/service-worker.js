const cacheVersion = 'v1';

self.addEventListener('install', function (event) {
  self.skipWaiting();

  event.waitUntil(
    caches.open(cacheVersion).then(function (cache) {
      return cache.addAll([
        './index.html'
      ]);
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(caches.match(event.request).then(function (response) {
    console.log(event)
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();

        caches.open(cacheVersion).then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return console.log('no cache response!');
      });
    }
  }));
});