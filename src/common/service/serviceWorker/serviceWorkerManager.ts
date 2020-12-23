import {Result} from '../../value/result'

export type ServiceWorkerStatus = ServiceWorkerState | 'unregistered'

export interface ServiceWorkerManager {
  readonly status: ServiceWorkerStatus
  register(): Promise<Result>
  waitStatus(status: ServiceWorkerStatus): Promise<Result>
  readonly sw: ServiceWorker
}
