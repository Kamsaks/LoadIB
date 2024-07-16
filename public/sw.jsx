const CacheKey = "cache-v1"

const initCache = () => {
    return caches.open(CacheKey).then((cache) =>{
        return cache.addAll([
            "./index.html"
        ]);
    },(error) => {
        console.log(error)
        }
    );
}

const tryNetwork = (req,timeout) => {
    console.log(req);
    return new Promise((resolve,reject) => {
        const timeout = setTimeout(reject,timeout);
        fetch(req).then((res) => {
            clearTimeout(timeoutID);
            const responseClone = res.clone();
            cache.open(CacheKey).then((cache) => {
                cache.put(req,responseClone)
            })
            resolve(res);
        }, reject);
    })
}

const getFromCache = (req)  => {
    console.log('Network is off get from cache')
    return caches.open(CacheKey).then((cache) => {
        return cache.match(req).then((result) => {
            return result || Promise.reject("no-match")
        })
    })
} 

self.addEventListener('install', (event) => {
    console.log('Установлен');
    event.waitUntil(initCache())
});

self.addEventListener('activate', (event) => {
    console.log('Активирован');
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key != CacheKey) {
                    return caches.delete(key);
                }
            }));
        } )
    );
});

self.addEventListener('fetch', (event) => {
    console.log('Происходит запрос на сервер');
    event.respondWith(tryNetwork(event.request,400).catch(() => getFromCache(event.request)));
});