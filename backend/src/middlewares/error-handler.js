import { HttpError } from '../error-handling/httpError.js'

export const errorHandler = (error, req, res, next) => {
  console.log(error.stack)
  if (error instanceof HttpError) return res.status(error.statusCode).json({ message: error.message })
  res.status(500).send({ message: 'Something went wrong' })
}
