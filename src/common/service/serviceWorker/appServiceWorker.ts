import {inject, injectable} from 'inversify'
import {RootDIType} from '../../dependencyInjection/rootType'
import {Config} from '../../config'
import {AppResult, AppResultError, Result} from '../../value/result'
import {ServiceWorkerManager, ServiceWorkerStatus} from './'
import {ErrorChain} from '../../value/errorChain'

const swStatusOrder = (status: ServiceWorkerStatus) => {
  switch (status) {
    case 'unregistered':
      return 0
    case 'parsed':
      return 1
    case 'installing':
      return 2
    case 'installed':
      return 3
    case 'activating':
      return 4
    case 'activated':
      return 5
    case 'redundant':
      return 6
  }
}

@injectable()
export class AppServiceWorker implements ServiceWorkerManager {
  private registration?: ServiceWorkerRegistration

  constructor(@inject(RootDIType.Config) private config: Config) {}

  get status() {
    const sw = this.getServiceWorker()

    if (!sw) {
      return 'unregistered'
    }

    return sw.state
  }

  async register() {
    if (!('serviceWorker' in navigator)) {
      return new AppResultError('Browser does not support service worker')
    }

    if (navigator.serviceWorker.controller) {
      return new AppResult()
    }

    try {
      this.registration = await navigator.serviceWorker.register(this.config.serviceWorkerSrc)
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

  async waitStatus(status: ServiceWorkerStatus) {
    const sw = this.getServiceWorker()
    if (!sw) {
      return new AppResultError(`An attempt to wait ${status} status an unregistered service worker`)
    }

    if (swStatusOrder(this.status) >= swStatusOrder(status)) {
      return new AppResult()
    }

    return new Promise<Result>((resolve) => {
      const handleStatusChange = () => {
        if (swStatusOrder(this.status) >= swStatusOrder(status)) {
          sw.removeEventListener('statechange', handleStatusChange)
          resolve(new AppResult())
        }
      }

      sw.addEventListener('statechange', handleStatusChange)
    })
  }

  private getServiceWorker() {
    if (navigator.serviceWorker.controller) {
      return navigator.serviceWorker.controller
    }

    if (!this.registration) {
      return undefined
    }

    if (this.registration.installing) {
      return this.registration.installing
    }

    if (this.registration.waiting) {
      return this.registration.waiting
    }

    if (this.registration.active) {
      return this.registration.active
    }

    return undefined
  }

  get sw() {
    const sw = this.getServiceWorker()

    if (!sw) {
      throw 'ERRROR'
    }

    return sw
  }
}
