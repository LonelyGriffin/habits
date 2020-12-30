import {Time} from './time'

export type Period<T extends Time> = {
  from: T
  to: T | 'infinity'
}
