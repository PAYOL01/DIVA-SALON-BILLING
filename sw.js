const CACHE_NAME = "diva-salon-v3";

const APP_FILES = [
  "/DIVA-SALON-BILLING/",
  "/DIVA-SALON-BILLING/index.html",
  "/DIVA-SALON-BILLING/manifest.json",
  "/DIVA-SALON-BILLING/icon-192.png",
  "/DIVA-SALON-BILLING/icon-512.png"
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

    caches.keys().then(function(names) {

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

  if(event.request.method !== "GET") {
    return;
  }

  event.respondWith(

    fetch(event.request)
      .then(function(response) {

        if(response && response.ok) {

          const copy = response.clone();

          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, copy);
            });

        }

        return response;

      })

      .catch(function() {

        return caches.match(event.request);

      })

  );

});
