import {ScreenType} from './screenType'
import {Route} from './route'

export interface Router {
  replaceTo(screenType: ScreenType): void
  subscribe(cb: (currentRoute: Route) => void): () => void
}
