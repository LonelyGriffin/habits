import {Moment} from 'moment'
import {Optional} from '../../value/optional'
import {DiaryNote} from '../../entity/diaryNote'
import {AsyncResult, Result} from '../../value/result'

export interface DiaryNoteRepository {
  getByDate(date: Moment): Promise<Result<Optional<DiaryNote>>>
  set(diaryNote: DiaryNote): Promise<Result>
  all(): AsyncResult<DiaryNote[]>
  resetAll(all: DiaryNote[]): AsyncResult
}
