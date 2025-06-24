const CACHE_NAME = "rust-raid-github-v1.0.0"
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "https://via.placeholder.com/192x192/8B4513/FFD700?text=🦀",
  "https://via.placeholder.com/512x512/8B4513/FFD700?text=🦀",
]

// Установка Service Worker
self.addEventListener("install", (event) => {
  console.log("Service Worker: Установка")
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Кэширование файлов")
      return cache.addAll(urlsToCache)
    }),
  )
})

// Активация Service Worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Активация")
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Service Worker: Удаление старого кэша", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

// Обработка запросов
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Возвращаем кэшированную версию или загружаем из сети
      if (response) {
        return response
      }
      return fetch(event.request)
    }),
  )
})

// Push уведомления
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push уведомление получено")

  const options = {
    body: event.data ? event.data.text() : "🦀 Новое уведомление от команды!",
    icon: "https://via.placeholder.com/192x192/8B4513/FFD700?text=🦀",
    badge: "https://via.placeholder.com/192x192/8B4513/FFD700?text=🦀",
    vibrate: [200, 100, 200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "open",
        title: "Открыть приложение",
        icon: "https://via.placeholder.com/192x192/8B4513/FFD700?text=🦀",
      },
      {
        action: "close",
        title: "Закрыть",
        icon: "https://via.placeholder.com/192x192/8B4513/FFD700?text=🦀",
      },
    ],
    requireInteraction: true,
    silent: false,
  }

  event.waitUntil(self.registration.showNotification("🦀 Rust Raid System", options))
})

// Обработка кликов по уведомлениям
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Клик по уведомлению")

  event.notification.close()

  if (event.action === "open") {
    event.waitUntil(clients.openWindow("/"))
  }
})

// Фоновая синхронизация
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    console.log("Service Worker: Фоновая синхронизация")
    event.waitUntil(doBackgroundSync())
  }
})

function doBackgroundSync() {
  // Здесь можно синхронизировать данные с сервером
  return Promise.resolve()
}

// Обработка сообщений от главного потока
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})
