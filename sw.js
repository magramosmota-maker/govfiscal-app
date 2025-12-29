const CACHE_NAME = 'govfiscal-v12-offline'; // Mudei o nome para forçar atualização
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// 1. INSTALAÇÃO: Salva os arquivos essenciais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Arquivos salvos no cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // Força o SW a ativar imediatamente
});

// 2. USO: Estratégia "Network First" (Tenta Internet -> Se falhar, usa Cache)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// 3. LIMPEZA: Apaga caches velhos quando atualizamos a versão
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
