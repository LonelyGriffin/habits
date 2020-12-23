export interface Optional<T> {
  readonly isSame: boolean
  readonly isNone: boolean
  unwrap(): T
}

export class AppSame<T> implements Optional<T> {
  constructor(private value: T) {}

  get isSame() {
    return true
  }
  get isNone() {
    return false
  }
  unwrap() {
    return this.value
  }
}

export class AppNone<T = any> implements Optional<T> {
  constructor() {}

  get isSame() {
    return false
  }
  get isNone() {
    return true
  }
  unwrap(): T {
    throw new Error(
      'An attempt was made to unpack the result with an error. You may not have verified the success of the result'
    )
  }
}
