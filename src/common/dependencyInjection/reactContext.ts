import {createContext} from 'react'
import {Container} from 'inversify'

export const DIContainerContext = createContext<Container>(new Container())
DIContainerContext.displayName = 'DIContainerContext'
