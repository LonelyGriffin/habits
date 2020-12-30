import {Habit, HabitValue} from '../../entity/habit'
import {AsyncResult} from '../../value/result'
import {Optional} from '../../value/optional'
import {Period} from '../../entity/period'
import {Day} from '../../entity/time'

export interface HabitRepository {
  set(habit: Habit): AsyncResult
  setValue(value: HabitValue): AsyncResult
  getById(id: string): AsyncResult<Optional<Habit>>
  getByPeriod(period: Period<Day>): AsyncResult<Iterable<Habit>>
  getValues(period: Period<Day>, habitId: string): AsyncResult<Iterable<HabitValue>>
}
