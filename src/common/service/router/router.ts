import {ScreenType} from './screenType'
import {Route} from './route'

export interface Router {
  readonly currentRoute: Readonly<Route>
  replaceTo(screenType: ScreenType): void
  subscribe(subscriber: (currentRoute: Route) => void): () => void
}
