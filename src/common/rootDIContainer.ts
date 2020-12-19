import {Container} from 'inversify'
import {RootDIType} from './rootDIType'
import {Router} from './service/router'
import {AppRouter} from './service/router/appRouter'
import {createBrowserHistory, History} from 'history'

export const createRootDIContainer = () => {
  const container = new Container()

  container.bind<History>(RootDIType.History).toConstantValue(createBrowserHistory())
  container.bind<Router>(RootDIType.Router).to(AppRouter)

  return container
}
