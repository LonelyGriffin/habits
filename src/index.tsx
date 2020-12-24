import 'reflect-metadata'
import 'antd/dist/antd.less'
import React from 'react'
import ReactDOM from 'react-dom'
import Root from './common/view/Root/Root'
import {createRootDIContainer} from './common/dependencyInjection/rootContainer'
import {DIContainerContext} from './common/dependencyInjection/reactContext'
import {ConfigProvider as AntdConfigProvider} from 'antd'
import ruRuLocale from 'antd/lib/locale/ru_RU'
import {ServiceWorkerManager} from './common/service/serviceWorker'
import {RootDIType} from './common/dependencyInjection/rootType'
import {DataBase} from './common/service/dataBase'
import {FastClick} from 'fastclick'

const activateFastClick = () => {
  debugger
  FastClick.attach(document.body)
}

;(async () => {
  const rootDIContainer = createRootDIContainer()

  const sw = rootDIContainer.get<ServiceWorkerManager>(RootDIType.ServiceWorker)
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

  ReactDOM.render(
    <React.StrictMode>
      <DIContainerContext.Provider value={rootDIContainer}>
        <AntdConfigProvider locale={ruRuLocale}>
          <Root />
        </AntdConfigProvider>
      </DIContainerContext.Provider>
    </React.StrictMode>,
    document.getElementById('root')
  )
})()
