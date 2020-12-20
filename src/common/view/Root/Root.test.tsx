import React from 'react'
import {render} from '@testing-library/react'
import Root from './Root'
import {DIContainerContext} from '../../dependencyInjection/reactContext'
import {createRootDIContainer} from '../../dependencyInjection/rootContainer'

test('renders without crash', () => {
  const rootDIContainer = createRootDIContainer()
  render(
    <DIContainerContext.Provider value={rootDIContainer}>
      <Root />
    </DIContainerContext.Provider>
  )
})
