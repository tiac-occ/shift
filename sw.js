// 定義快取名稱
const CACHE_NAME = 'shift-platform-cache-v1';
// 定義需要被快取的核心檔案
const urlsToCache = [
  './index.html'
];

// 監聽 install 事件，PWA 被安裝時觸發
self.addEventListener('install', event => {
  // 等待快取操作完成
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache); // 將核心檔案加入快取
      })
  );
});

// 監聽 fetch 事件，攔截所有網路請求
self.addEventListener('fetch', event => {
  event.respondWith(
    // 嘗試從快取中尋找對應的回應
    caches.match(event.request)
      .then(response => {
        // 如果快取中有，就直接回傳快取的版本
        if (response) {
          return response;
        }
        // 如果快取中沒有，就正常發出網路請求
        return fetch(event.request);
      }
    )
  );
});