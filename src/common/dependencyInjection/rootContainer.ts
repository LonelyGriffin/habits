import {Container} from 'inversify'
import {RootDIType} from './rootType'
import {Router} from '../service/router'
import {AppRouter} from '../service/router/appRouter'
import {createBrowserHistory, History} from 'history'
import {Config, CONFIG} from '../config'
import {ServiceWorkerService} from '../service/serviceWorker'
import {AppServiceWorkerService} from '../service/serviceWorker/appServiceWorkerService'
import {DataBase} from '../service/dataBase'
import {AppDataBase} from '../service/dataBase/appDataBase'
import {DiaryNoteRepository} from '../repository/diaryNote/diaryNoteRepository'
import {AppDiaryNoteRepository} from '../repository/diaryNote/appDiaryNoteRepository'
import {AppYadisk} from '../service/yadisk/appYadisk'
import {Yadisk} from '../service/yadisk'

export const createRootDIContainer = () => {
  const container = new Container()

  container.bind<Config>(RootDIType.Config).toConstantValue(CONFIG)
  container.bind<ServiceWorkerService>(RootDIType.ServiceWorker).to(AppServiceWorkerService).inSingletonScope()
  container.bind<History>(RootDIType.History).toConstantValue(createBrowserHistory())
  container.bind<Router>(RootDIType.Router).to(AppRouter).inSingletonScope()
  container.bind<DataBase>(RootDIType.DataBase).to(AppDataBase).inSingletonScope()
  container.bind<DiaryNoteRepository>(RootDIType.DiaryNoteRepository).to(AppDiaryNoteRepository).inSingletonScope()
  container.bind<Yadisk>(RootDIType.Yadisk).to(AppYadisk).inSingletonScope()

  return container
}
