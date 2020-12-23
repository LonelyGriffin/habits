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

;(async () => {
  const rootDIContainer = createRootDIContainer()

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

  const sw = rootDIContainer.get<ServiceWorkerManager>(RootDIType.ServiceWorker)
  const isSwRegistered = await sw.register()

  if (isSwRegistered.isFailed) {
    throw isSwRegistered.error.unwrap()
  }
  console.log('registered')
  const isSwInstalled = await sw.waitStatus('installed')

  if (isSwInstalled.isFailed) {
    throw isSwInstalled.error.unwrap()
  }

  console.log('activated')
})()
