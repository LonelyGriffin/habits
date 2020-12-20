import {createRootDIContainer} from '../../dependencyInjection/rootContainer'
import {RootDIType} from '../../dependencyInjection/rootType'
import {Route, Router, ScreenType} from './'
import {createMemoryHistory, History} from 'history'

const setup = () => {
  const rootContainer = createRootDIContainer()

  rootContainer.unbind(RootDIType.History)
  rootContainer.bind<History>(RootDIType.History).toConstantValue(createMemoryHistory())

  const router = rootContainer.get<Router>(RootDIType.Router)
  const history = rootContainer.get<History>(RootDIType.History)

  return {
    router,
    history
  }
}

describe('service', () => {
  describe('AppRouter', () => {
    describe('Method replaceTo', () => {
      test('Should fire subscribers', () => {
        const {router} = setup()
        const subscriber = jest.fn()
        const diaryRoute: Route = {screenType: ScreenType.Diary}
        const habitsRoute: Route = {screenType: ScreenType.Habits}

        router.subscribe(subscriber)

        router.replaceTo(diaryRoute.screenType)
        router.replaceTo(habitsRoute.screenType)

        expect(subscriber).toHaveBeenNthCalledWith(1, diaryRoute)
        expect(subscriber).toHaveBeenNthCalledWith(2, habitsRoute)
      })
      test('Should have actual current route', () => {
        const {router} = setup()
        const diaryRoute: Route = {screenType: ScreenType.Diary}
        const habitsRoute: Route = {screenType: ScreenType.Habits}

        router.replaceTo(diaryRoute.screenType)
        expect(router.currentRoute).toEqual(diaryRoute)

        router.replaceTo(habitsRoute.screenType)
        expect(router.currentRoute).toEqual(habitsRoute)
      })
      test('Should change history', () => {
        const {router, history} = setup()
        const diaryRoute: Route = {screenType: ScreenType.Diary}
        const habitsRoute: Route = {screenType: ScreenType.Habits}

        router.replaceTo(diaryRoute.screenType)
        expect(history.location.pathname).toEqual('/' + diaryRoute.screenType)

        router.replaceTo(habitsRoute.screenType)
        expect(history.location.pathname).toEqual('/' + habitsRoute.screenType)
      })
    })
  })
})
