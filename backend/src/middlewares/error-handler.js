import { HttpError, ValidationError } from '../error-handling/httpError.js'

export const errorHandler = (error, req, res, next) => {
  console.log(error.stack)
  if (error instanceof HttpError) return res.status(error.statusCode).json({ error: error.message })
  if (error instanceof ValidationError) return res.status(error.statusCode).json({ error: error.message })
  res.status(500).send({ error: 'Something went wrong' })
}
