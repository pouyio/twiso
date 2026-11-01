self.addEventListener('fetch', (event) => {
  if (/\.jpg$/.test(event.request.url)) {
    event.respondWith(
      caches.open('images-cache').then((cache) => {
        return cache.match(event.request).then((response) => {
          return (
            response ||
            fetch(event.request).then((response) => {
              cache.put(event.request, response.clone());
              return response;
            })
          );
        });
      }),
    );
  } else {
    event.respondWith(fetch(event.request));
  }
});
