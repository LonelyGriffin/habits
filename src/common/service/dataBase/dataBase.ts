import {Result} from '../../value/result'
import {IDBPDatabase} from 'idb'
import {DataBaseSchema} from './schema'

export interface DataBase {
  readonly idb: IDBPDatabase<DataBaseSchema>

  init(): Promise<Result>
}
