// sw.js
// 步驟 1: 版本號升級！ (從 v4 改為 v5 以強制更新)
const CACHE_NAME = 'shift-platform-cache-v5'; 
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-512.png'
  // 如果有其他圖片，請加在這裡
];

// 安裝 Service Worker
self.addEventListener('install', event => {
  self.skipWaiting(); // 強制新的 Service Worker 立即啟用
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and added core files');
        return cache.addAll(urlsToCache);
      })
  );
});

// 步驟 2: 清理舊快取
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

// 步驟 3: 攔截網路請求 (這是修復 "申請失敗" 的關鍵！)
self.addEventListener('fetch', event => {
  
  // 【關鍵保護機制】
  // 如果請求方法不是 GET (例如 POST, PUT, DELETE)，
  // 或是請求的網址包含 Google Apps Script (script.google.com)，
  // 則「不攔截」，直接 return，讓瀏覽器用預設方式連線。
  if (event.request.method !== 'GET' || event.request.url.includes('script.google.com')) {
    return;
  }

  // 只有普通的讀取 (GET)，才使用快取加速
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果快取有，就回傳快取；如果沒有，就去網路抓
        return response || fetch(event.request);
      })
  );
});