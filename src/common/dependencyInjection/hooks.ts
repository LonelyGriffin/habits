import {useContext, useMemo} from 'react'
import {Container, interfaces} from 'inversify'
import {DIContainerContext} from './reactContext'

export const useContainer = (): Container => useContext(DIContainerContext)
export const useService = <T>(id: interfaces.ServiceIdentifier<T>): T => {
  const container = useContainer()
  return useMemo(() => container.get<T>(id), [container, id])
}
