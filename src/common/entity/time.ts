import {Moment} from 'moment'

export interface Time {
  toIsoString(): string
  toMoment(): Moment
}

export class Day implements Time {
  private value: Moment

  constructor(value: Moment) {
    this.value = value.endOf('day')
  }
  toIsoString() {
    return this.value.toISOString()
  }
  toMoment() {
    return this.value.clone()
  }
}

export class Minute implements Time {
  private value: Moment

  constructor(value: Moment) {
    this.value = value.endOf('minute')
  }
  toIsoString() {
    return this.value.toISOString()
  }
  toMoment() {
    return this.value.clone()
  }
}
