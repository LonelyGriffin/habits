import {Period} from './period'
import {Day} from './time'

type BaseHabit = {
  name: string
  period: Period<Day>
}

type BooleanHabit = BaseHabit & {
  type: 'boolean'
}

type CountHabit = BaseHabit & {
  type: 'count'
  targetCount: number | 'max' | 'min'
}

export type Habit = BooleanHabit | CountHabit

export type HabitValue = {
  habitId: string
  value: string
  date: Day
}
