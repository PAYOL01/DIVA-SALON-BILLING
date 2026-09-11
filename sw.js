const CACHE_NAME = "diva-salon-v1";

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json"
];

self.addEventListener("install", function(event) {

  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
      return cache.addAll(APP_FILES);
    })
  );

  self.skipWaiting();

});


self.addEventListener("activate", function(event) {

  event.waitUntil(

    caches.keys()
    .then(function(names) {

      return Promise.all(

        names.map(function(name) {

          if(name !== CACHE_NAME) {
            return caches.delete(name);
          }

        })

      );

    })

  );

  self.clients.claim();

});


self.addEventListener("fetch", function(event) {

  event.respondWith(

    fetch(event.request)
    .then(function(response) {

      const copy =
        response.clone();

      caches.open(CACHE_NAME)
      .then(function(cache) {

        cache.put(
          event.request,
          copy
        );

      });

      return response;

    })
    .catch(function() {

      return caches.match(
        event.request
      );

    })

  );

});
