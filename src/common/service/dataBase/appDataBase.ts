import {DataBase} from './dataBase'
import {inject, injectable} from 'inversify'
import {RootDIType} from '../../dependencyInjection/rootType'
import {Config} from '../../config'
import {IDBPDatabase, openDB} from 'idb'
import {DataBaseSchema} from './schema'
import {AppResult, AppResultError} from '../../value/result'
import {ErrorChain} from '../../value/errorChain'

@injectable()
export class AppDataBase implements DataBase {
  private _connection?: IDBPDatabase<DataBaseSchema>

  constructor(@inject(RootDIType.Config) private config: Config) {}

  get connection() {
    if (!this._connection) {
      throw 'Trying to access the database without initialization'
    }

    return this._connection
  }

  async init() {
    try {
      this._connection = await openDB<DataBaseSchema>('storage', 1, {
        upgrade(db) {
          const diaryStoreStore = db.createObjectStore('diary_note', {
            keyPath: 'id'
          })
          diaryStoreStore.createIndex('by_date', 'date')
        }
      })

      return new AppResult()
    } catch (e) {
      return new AppResultError(
        new ErrorChain({
          msg: 'Opening database failed',
          nested: e
        })
      )
    }
  }
}
