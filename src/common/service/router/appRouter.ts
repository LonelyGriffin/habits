import {Route, Router, ScreenType} from './'
import {inject, injectable} from 'inversify'
import {EventEmitter} from 'events'
import {RootDIType} from '../../rootDIType'
import {History} from 'history'

enum EventType {
  CurrentRouteChanged = 'CurrentRouteChanged'
}

@injectable()
export class AppRouter implements Router {
  private internalCurrentRoute: Readonly<Route> = {
    screenType: ScreenType.Habits
  }
  private eventEmitter = new EventEmitter()

  constructor(@inject(RootDIType.History) private history: History) {}

  get currentRoute() {
    return this.internalCurrentRoute
  }

  replaceTo(screenType: ScreenType): void {
    this.internalCurrentRoute = {screenType}

    const {to} = this.routeToHistoryParams(this.internalCurrentRoute)
    this.history.replace(to)

    this.eventEmitter.emit(EventType.CurrentRouteChanged, this.internalCurrentRoute)
  }

  subscribe(subscriber: (currentRoute: Route) => void): () => void {
    this.eventEmitter.addListener(EventType.CurrentRouteChanged, subscriber)
    return () => {
      this.eventEmitter.removeListener(EventType.CurrentRouteChanged, subscriber)
    }
  }

  private routeToHistoryParams(route: Route) {
    return {
      to: '/' + route.screenType
    }
  }
}
