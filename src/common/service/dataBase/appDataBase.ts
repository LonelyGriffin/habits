import {DataBase} from './dataBase'
import {inject, injectable} from 'inversify'
import {RootDIType} from '../../dependencyInjection/rootType'
import {Config} from '../../config'
import {IDBPDatabase, openDB} from 'idb'
import {DataBaseSchema} from './schema'
import {AppResult, AppResultError} from '../../value/result'

injectable()
export class AppDataBase implements DataBase {
  private _idb?: IDBPDatabase<DataBaseSchema>

  constructor(@inject(RootDIType.Config) private config: Config) {}

  get idb() {
    if (!this._idb) {
      throw 'Trying to access the database without initialization'
    }

    return this._idb
  }

  async init() {
    try {
      this._idb = await openDB<DataBaseSchema>('storage', 1, {
        upgrade(db) {
          const diaryStoreStore = db.createObjectStore('diary_notion', {
            keyPath: 'id'
          })
          diaryStoreStore.createIndex('by_date', 'date')
        }
      })

      return new AppResult()
    } catch (e) {
      return new AppResultError('Opening database failed')
    }
  }
}
