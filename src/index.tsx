import 'reflect-metadata'
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Root from './common/view/Root/Root'
import {createRootDIContainer} from './common/dependencyInjection/rootContainer'
import {DIContainerContext} from './common/dependencyInjection/reactContext'
// import * as serviceWorkerRegistration from './serviceWorkerRegistration'
// import reportWebVitals from './reportWebVitals'

const rootDIContainer = createRootDIContainer()

ReactDOM.render(
  <React.StrictMode>
    <DIContainerContext.Provider value={rootDIContainer}>
      <Root />
    </DIContainerContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
