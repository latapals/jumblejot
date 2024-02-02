self.oninstall = (event) => {
  event.waitUntil(
    caches.open("pwa-assets").then((cache) => {
      return cache.addAll(["app/index.html"])
    })
  )
}

self.onload = (event) => {
  event.waitUntil(
    caches.open("pwa-assets").then((cache) => {
      return cache.addAll(["app/index.html"])
    })
  )
}

self.onfetch = (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request)
    })
  )
}