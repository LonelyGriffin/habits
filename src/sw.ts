import {precacheAndRoute} from 'workbox-precaching/precacheAndRoute'

const DB_VERSION = 1
const SW_VERSION = 1

const scope: ServiceWorkerGlobalScope = self as any
precacheAndRoute((self as any).__WB_MANIFEST)

scope.addEventListener('install', (event) => {
  console.log(`Installing service worker v${SW_VERSION}`)

  event.waitUntil(
    new Promise((resolve, reject) => {
      const request = self.indexedDB.open('db', DB_VERSION)

      request.onerror = (event) => {
        console.log('error opening IndexedDB')
        reject()
      }
    })
  )
})

scope.addEventListener('activate', () => {
  console.log(`Activating service worker v${SW_VERSION}`)
})
