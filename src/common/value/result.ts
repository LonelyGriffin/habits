import {ErrorChain} from './errorChain'
import {AppNone, AppSame, Optional} from './optional'

export interface Result<T = void, E extends Error = any> {
  readonly isSuccess: boolean
  readonly isFailed: boolean
  readonly error: Optional<E>

  unwrap(): T
}

export class AppResult<T = void, E extends Error = any> implements Result<T, E> {
  private readonly value: T
  constructor(value?: T) {
    this.value = value !== undefined ? value : (undefined as any)
  }

  get isSuccess() {
    return true
  }

  get isFailed() {
    return false
  }

  get error() {
    return new AppNone<E>()
  }

  unwrap(): T {
    return this.value
  }
}

export class AppResultError<E extends Error = Error, T = any> implements Result<T, E> {
  private readonly _error: E

  constructor(reason: E | string) {
    this._error = typeof reason === 'string' ? (new Error(reason) as E) : reason
  }

  get isSuccess() {
    return false
  }

  get isFailed() {
    return true
  }

  get error() {
    return new AppSame(this._error)
  }

  unwrap(): T {
    throw new ErrorChain({
      msg:
        'An attempt was made to unpack the result with an error. You may not have verified the success of the result',
      nested: this._error
    })
  }
}
