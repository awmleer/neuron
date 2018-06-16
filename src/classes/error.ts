export class ApiError extends Error {
  constructor(
    message: string,
    public payload?: any
  ) {
    super(message)
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}
