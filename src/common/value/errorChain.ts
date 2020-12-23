export class ErrorChain extends Error {
  readonly nested?: Error
  constructor({msg, nested}: {msg?: string; nested?: Error}) {
    super(msg)

    this.nested = nested
  }
}
