const onWorkerReady = () => {
    console.log('Sw is ready')
}

navigator.serviceWorker.register(sw.js)

navigator.serviceWorker.ready.then(onWorkerReady)