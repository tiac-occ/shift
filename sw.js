// --- ▼▼▼ 請用以下全部內容，取代您 sw.js 的所有內容 ▼▼▼ ---

// 步驟 1: 版本號升級！
const CACHE_NAME = 'shift-platform-cache-v4'; 
const urlsToCache = [
  './index.html'
];

// 安裝 Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and added core files');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // 強制新的 Service Worker 立即啟用
});

// 步驟 2: 新增 activate 事件，用來清理舊快取
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // 只保留最新版本的快取
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName); // 刪除所有不是最新版本的快取
          }
        })
      );
    })
  );
});

// 攔截網路請求
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // 從快取回應
        }
        return fetch(event.request); // 從網路請求
      }
    )
  );
});
// --- ▲▲▲ 取代結束 ▲▲▲ ---