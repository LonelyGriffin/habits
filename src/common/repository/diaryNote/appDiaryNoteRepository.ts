import moment, {Moment} from 'moment'
import {AppResult, AppResultError, Result} from '../../value/result'
import {AppNone, AppSame, Optional} from '../../value/optional'
import {DiaryNote} from '../../entity/diaryNote'
import {DiaryNoteRepository} from './diaryNoteRepository'
import {inject, injectable} from 'inversify'
import {RootDIType} from '../../dependencyInjection/rootType'
import {DataBase} from '../../service/dataBase'
import {ErrorChain} from '../../value/errorChain'

@injectable()
export class AppDiaryNoteRepository implements DiaryNoteRepository {
  constructor(@inject(RootDIType.DataBase) private db: DataBase) {}
  async getByDate(date: Moment): Promise<Result<Optional<DiaryNote>>> {
    try {
      const result = await this.db.connection.getFromIndex('diary_note', 'by_date', date.toISOString())

      if (result === undefined) {
        return new AppResult(new AppNone())
      }

      const resultWithParsedDate = {
        ...result,
        date: moment(result.date)
      }

      return new AppResult(new AppSame(resultWithParsedDate))
    } catch (e) {
      return new AppResultError(
        new ErrorChain({
          msg: `An error occurred while trying to get diary note by date = ${date.toISOString()}`,
          nested: e
        })
      )
    }
  }
  async set(diaryNote: DiaryNote): Promise<Result> {
    try {
      const diaryNoteSerializedDate = {
        ...diaryNote,
        date: diaryNote.date.toISOString()
      }

      await this.db.connection.put('diary_note', diaryNoteSerializedDate)
      localStorage.setItem('timestamp', moment().toISOString())
      return new AppResult()
    } catch (e) {
      return new AppResultError(
        new ErrorChain({
          msg: `An error occurred while trying to set diary note with id = ${diaryNote.id}`,
          nested: e
        })
      )
    }
  }
  async all() {
    try {
      const all = await this.db.connection.getAll('diary_note')

      return new AppResult(all.map((x) => ({...x, date: moment(x.date)})))
    } catch (e) {
      return new AppResultError(
        new ErrorChain({
          msg: `An error occurred while trying to get all diary notes`,
          nested: e
        })
      )
    }
  }
  async resetAll(all: DiaryNote[]) {
    await this.db.connection.clear('diary_note')

    for (let item of all) {
      await this.set(item)
    }

    return new AppResult()
  }
}
