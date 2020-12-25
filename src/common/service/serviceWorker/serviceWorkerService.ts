import {Result} from '../../value/result'

export type ServiceWorkerStatus = ServiceWorkerState | 'unregistered'

export interface ServiceWorkerService {
  register(): Promise<Result>
}
