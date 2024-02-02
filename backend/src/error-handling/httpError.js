export class HttpError extends Error {
  constructor (message, statusCode) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode || 500
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends HttpError {
  constructor (message) {
    super(message, 400)
    this.message = JSON.parse(message)
  }
}
