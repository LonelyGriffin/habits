import {Container} from 'inversify'
import {RootDIType} from './rootType'
import {Router} from '../service/router'
import {AppRouter} from '../service/router/appRouter'
import {createBrowserHistory, History} from 'history'
import {Config, CONFIG} from '../config'
import {ServiceWorkerManager} from '../service/serviceWorker'
import {AppServiceWorker} from '../service/serviceWorker/appServiceWorker'
import {DataBase} from '../service/dataBase'
import {AppDataBase} from '../service/dataBase/appDataBase'
import {DiaryNoteRepository} from '../repository/diaryNote/diaryNoteRepository'
import {AppDiaryNoteRepository} from '../repository/diaryNote/appDiaryNoteRepository'

export const createRootDIContainer = () => {
  const container = new Container()

  container.bind<Config>(RootDIType.Config).toConstantValue(CONFIG)
  container.bind<ServiceWorkerManager>(RootDIType.ServiceWorker).to(AppServiceWorker).inSingletonScope()
  container.bind<History>(RootDIType.History).toConstantValue(createBrowserHistory())
  container.bind<Router>(RootDIType.Router).to(AppRouter).inSingletonScope()
  container.bind<DataBase>(RootDIType.DataBase).to(AppDataBase).inSingletonScope()
  container.bind<DiaryNoteRepository>(RootDIType.DiaryNoteRepository).to(AppDiaryNoteRepository).inSingletonScope()

  return container
}
