import {Container} from 'inversify'
import {RootDIType} from './rootType'
import {Router} from '../service/router'
import {AppRouter} from '../service/router/appRouter'
import {createBrowserHistory, History} from 'history'
import {Config, CONFIG} from '../config'
import {ServiceWorkerManager} from '../service/serviceWorker'
import {AppServiceWorker} from '../service/serviceWorker/appServiceWorker'

export const createRootDIContainer = () => {
  const container = new Container()

  container.bind<Config>(RootDIType.Config).toConstantValue(CONFIG)
  container.bind<ServiceWorkerManager>(RootDIType.ServiceWorker).to(AppServiceWorker).inSingletonScope()
  container.bind<History>(RootDIType.History).toConstantValue(createBrowserHistory())
  container.bind<Router>(RootDIType.Router).to(AppRouter).inSingletonScope()

  return container
}
