import {AsyncResult} from '../../value/result'

export interface Yadisk {
  setToken(token: string): AsyncResult
  hasToken(): boolean
  sync(): AsyncResult
}
