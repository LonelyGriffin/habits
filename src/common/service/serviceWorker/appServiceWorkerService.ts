import {inject, injectable} from 'inversify'
import {RootDIType} from '../../dependencyInjection/rootType'
import {Config} from '../../config'
import {AppResult, AppResultError, Result} from '../../value/result'
import {ServiceWorkerService, ServiceWorkerStatus} from './'
import {ErrorChain} from '../../value/errorChain'
import {messageSW, Workbox} from 'workbox-window'

@injectable()
export class AppServiceWorkerService implements ServiceWorkerService {
  private registration?: ServiceWorkerRegistration

  constructor(@inject(RootDIType.Config) private config: Config) {}

  async register() {
    if (!('serviceWorker' in navigator)) {
      return new AppResultError('Browser does not support service worker')
    }

    try {
      const wb = new Workbox(this.config.serviceWorkerSrc)

      const showSkipWaitingPrompt = () => {
        // `event.wasWaitingBeforeRegister` will be false if this is
        // the first time the updated service worker is waiting.
        // When `event.wasWaitingBeforeRegister` is true, a previously
        // updated service worker is still waiting.
        // You may want to customize the UI prompt accordingly.

        // Assumes your app has some sort of prompt UI element
        // that a user can either accept or reject.
        if (confirm('Обновить приложение?')) {
          wb.addEventListener('controlling', (event) => {
            window.location.reload()
          })

          if (this.registration && this.registration.waiting) {
            // Send a message to the waiting service worker,
            // instructing it to activate.
            // Note: for this to work, you have to add a message
            // listener in your service worker. See below.
            messageSW(this.registration.waiting, {type: 'SKIP_WAITING'})
          }
        }
      }

      // Add an event listener to detect when the registered
      // service worker has installed but is waiting to activate.
      wb.addEventListener('waiting', showSkipWaitingPrompt)
      // wb.addEventListener('externalwaiting', showSkipWaitingPrompt);

      this.registration = await wb.register()

      return new AppResult()
    } catch (e) {
      return new AppResultError(
        new ErrorChain({
          msg: 'An unknown error occurred while trying register service worker',
          nested: e
        })
      )
    }
  }
}
