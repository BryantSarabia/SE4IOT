import { HttpError } from '../error-handling/httpError'

export const errorHandler = (error, req, res, next) => {
  console.error(error.stack)
  if (error instanceof HttpError) return res.status(error.statusCode).json({ message: error.message })
  res.status(500).json({ message: 'Something went wrong' })
}
