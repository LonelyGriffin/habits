import 'reflect-metadata'
import React from 'react'
import ReactDOM from 'react-dom'
import Root from './common/view/Root/Root'
import {createRootDIContainer} from './common/dependencyInjection/rootContainer'
import {DIContainerContext} from './common/dependencyInjection/reactContext'
import {ServiceWorkerService} from './common/service/serviceWorker'
import {RootDIType} from './common/dependencyInjection/rootType'
import {DataBase} from './common/service/dataBase'
import {FastClick} from 'fastclick'
import CssBaseline from '@material-ui/core/CssBaseline'
import {MuiPickersUtilsProvider} from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import {Router, ScreenType} from './common/service/router'
import {History} from 'history'
import {Yadisk} from './common/service/yadisk'

const activateFastClick = () => {
  FastClick.attach(document.body)
}

;(async () => {
  const rootDIContainer = createRootDIContainer()

  const sw = rootDIContainer.get<ServiceWorkerService>(RootDIType.ServiceWorker)
  const isSwRegistered = await sw.register()
  if (isSwRegistered.isFailed) {
    throw isSwRegistered.error.unwrap()
  }

  // activateFastClick()

  const dataBaseService = rootDIContainer.get<DataBase>(RootDIType.DataBase)
  const dataBaseInit = await dataBaseService.init()
  if (dataBaseInit.isFailed) {
    throw dataBaseInit.error.unwrap()
  }

  const routerService = rootDIContainer.get<Router>(RootDIType.Router)
  const historyService = rootDIContainer.get<History>(RootDIType.History)

  const query = historyService.location.search
    .substring(1)
    .split('&')
    .reduce((result, pair) => {
      const x = pair.split('=')
      result[x[0]] = x[1]
      return result
    }, {} as Record<string, string>)

  if (query['route'] && query['route'] === '/oauth/yandex') {
    const yadiskService = rootDIContainer.get<Yadisk>(RootDIType.Yadisk)
    const hash = historyService.location.hash
      .substring(1)
      .split('&')
      .reduce((result, pair) => {
        const x = pair.split('=')
        result[x[0]] = x[1]
        return result
      }, {} as Record<string, string>)
    await yadiskService.setToken(hash['access_token'])
    window.location.href = 'https://beta.habits.lonelygriffin.com'
  }
  routerService.replaceTo(ScreenType.Diary)

  ReactDOM.render(
    <React.StrictMode>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <CssBaseline />
        <DIContainerContext.Provider value={rootDIContainer}>
          <Root />
        </DIContainerContext.Provider>
      </MuiPickersUtilsProvider>
    </React.StrictMode>,
    document.getElementById('root')
  )
})()
